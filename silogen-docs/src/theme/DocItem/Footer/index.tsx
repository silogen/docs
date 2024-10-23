import React from "react";
import Footer from "@theme-original/DocItem/Footer";
import type FooterType from "@theme/DocItem/Footer";
import type { WrapperProps } from "@docusaurus/types";
import { useDoc } from "@docusaurus/plugin-content-docs/client";

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): JSX.Element {
  const { frontMatter } = useDoc();

  // Check if metadata exists in frontMatter
  const metadata = (frontMatter as any).metadata as
    | {
        authors: { name: string }[];
        lastEdited: string;
      }
    | undefined;

  // Only render the custom content if metadata exists
  if (metadata) {
    return (
      <>
        <div
          style={{
            marginTop: 20,
            marginBottom: 20,
            fontSize: "0.8em",
            fontWeight: "bold",
            color: "gray",
          }}
        >
          Authors:
          <ul style={{ marginBottom: "5px" }}>
            {metadata.authors.map((author, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 5,
                }}
              >
                <span>{author.name}</span>
              </li>
            ))}
          </ul>
          Last edited:{" "}
          {new Date(metadata.lastEdited).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <Footer {...props} />
      </>
    );
  }

  // If no metadata, just return the original Footer
  return <Footer {...props} />;
}
