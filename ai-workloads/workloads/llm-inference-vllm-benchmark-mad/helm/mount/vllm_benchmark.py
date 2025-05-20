r"""
This script runs vLLM benchmarking scenarios from a CSV file and saves the results in a CSV file.

Usage:
    python vllm_benchmark.py --tool <path_to_tool> --scenario-file <path_to_scenario_csv_file>

Examples:
    python vllm_benchmark.py \
        --tool benchmark_latency.py \
        --scenario-file my_latency_scenarios.csv
    python vllm_benchmark.py \
        --tool benchmark_throughput.py \
        --scenario-file my_throughput_scenarios.csv \
        --result-dir my_results
    python vllm_benchmark.py \  # Do not run anything, just print the commands
        --dry-run \
        --tool benchmark_throughput.py \
        --scenario-file my_throughput_scenarios.csv
"""

import argparse
import csv
import json
import os
import subprocess
from pathlib import Path
from pprint import pprint
from typing import Dict, Optional, Tuple

parser = argparse.ArgumentParser(description="Run vLLM benchmarking scenarios from CSV file")
parser.add_argument("--tool", required=True, help="Path to tool python script")
parser.add_argument("--scenario-file", required=True, help="CSV file with scenarios")
parser.add_argument("--result-dir", default="results", help="Directory for storing result files")
parser.add_argument("--dry-run", action="store_true", help="Print commands without executing them")


def read_csv(filepath: str):
    """Read a CSV file and return a list of dictionaries with the data."""
    data = []

    with open(filepath, "r") as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            data.append(row)

    return data


def process_scenario_row(scenario_row: Dict) -> Tuple[Dict, Dict]:
    """Process a row from the scenario CSV file and return a tuple with scenario arguments and environment variables."""
    env_var_column_starts_with = "export "
    env_vars = {
        k[len(env_var_column_starts_with) :]: v
        for k, v in scenario_row.items()
        if k.lower().startswith(env_var_column_starts_with)
    }
    scenario_arguments = {k: v for k, v in scenario_row.items() if not k.lower().startswith(env_var_column_starts_with)}
    return scenario_arguments, env_vars


def run_vllm_scenario(
    tool: str,
    scenario_file: str,
    row_number: int,
    scenario_row: Dict,
    result_dir: str,
    dry_run: bool = False,
) -> Optional[str]:
    """Run a vLLM benchmarking scenario using designated tool and return the path to the output JSON file."""
    scenario_arguments, env_vars = process_scenario_row(scenario_row)
    filename_without_extension = Path(scenario_file).stem
    outjson = f"{result_dir}/result_{filename_without_extension}_{row_number}.json"
    # use list instead of str?

    model_root = os.environ["MODEL_ROOT"]
    benchmark_cmd_str = (
        f"python {tool} "
        + " ".join(
            [
                (
                    f"--{column}={os.path.join(model_root, value)}"
                    if column == "model" and os.path.exists(os.path.join(model_root, value))
                    else (f"--{column}{value}" if str(value).startswith("=") else f"--{column} {value}")
                )
                for column, value in scenario_arguments.items()
            ]
        )
        + f" --output-json {outjson}"  # Only this is vllm benchmarking tool-specific
    )
    print("Using environment variables:")
    pprint(env_vars)
    print("Running scenario with command:")
    print(benchmark_cmd_str)

    if dry_run:
        return None

    try:
        subprocess.run(benchmark_cmd_str, shell=True, check=True, env={**os.environ, **env_vars})
    except subprocess.CalledProcessError as e:
        print(f"Error running scenario: {e}")

    return outjson


def process_vllm_output_json(json_path: str, scenario_row: Dict) -> Dict:
    """Process vLLM output JSON file and return a dictionary with the relevant fields."""
    with open(json_path) as f:
        data = json.load(f)

    file_type = "latency" if "avg_latency" in data else "throughput"
    if file_type == "latency":
        return {
            "avg_latency (ms)": data["avg_latency"] * 1000,
            "p90_latency (ms)": data["percentiles"]["90"] * 1000,
            "p99_latency (ms)": data["percentiles"]["99"] * 1000,
            "avg_latency_per_tkn (ms)": data["avg_latency"] * 1000 / int(scenario_row["output-len"]),
        }
    else:
        return {
            "throughput_tot (tok/s)": int(data["tokens_per_second"]),
            "throughput_gen (tok/s)": int(
                int(scenario_row["num-prompts"]) * int(scenario_row["output-len"]) / data["elapsed_time"]
            ),
            "requests_per_second": data["requests_per_second"],
            "elapsed_time (s)": data["elapsed_time"],
            "total_num_tokens": data["total_num_tokens"],
        }


def main():
    args = parser.parse_args()

    scenario_data = read_csv(args.scenario_file)

    result_summary_dir = f"{args.result_dir}/summary"
    if not args.dry_run:
        subprocess.run(["mkdir", "-p", args.result_dir], check=True)
        subprocess.run(["mkdir", "-p", result_summary_dir], check=True)

    results = []
    for i, row in enumerate(scenario_data):
        print("*" * 80)
        print(f"Running scenario {i+1}/{len(scenario_data)}.")
        output_json = run_vllm_scenario(args.tool, args.scenario_file, i, row, args.result_dir, args.dry_run)
        if output_json:
            results.append({**process_vllm_output_json(output_json, row), **row})

    if not args.dry_run:
        outcsv = f"{result_summary_dir}/result_{Path(args.scenario_file).stem}.csv"
        fieldnames = results[0].keys()
        with open(outcsv, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)


if __name__ == "__main__":
    main()
