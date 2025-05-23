FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
ARG MONGODB_URI
ARG NEXTAUTH_SECRET
ARG GITHUB_BRANCH

# The following are needed since the build process requires them in order to build the static site.
# We need info about commits. See the docusaurus.config.internal.mts file.
ARG GITHUB_OWNER
ARG GITHUB_REPO
ARG GITHUB_ACCESS_TOKEN

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.local.dummy .env.local

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NO_TELEMETRY 1

RUN \
  if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner

RUN yarn global add pnpm

ENV GITHUB_BRANCH=''
ENV GITHUB_OWNER=''
ENV GITHUB_REPO=''
ENV GITHUB_ACCESS_TOKEN=''
ENV MONGODB_URI=''
ENV NEXTAUTH_SECRET=''
ENV NEXTAUTH_URL=''

WORKDIR /app

# next sets NODE_ENV
ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NO_TELEMETRY 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 tinacms

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/build-internal ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Change ownership of the entire /app directory
RUN chown -R tinacms:nodejs /app

USER 1001:1001

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

#CMD ["npm", "run", "dev:prod"]
#CMD ["tail", "-f", "/dev/null"]
CMD ["node", "server.js"]
