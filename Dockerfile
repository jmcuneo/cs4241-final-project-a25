# Create a non-root user for security
# RUN addgroup --system appgroup && adduser --system --uid 1001 -G appgroup appuser
# USER appuser

# # Copy only necessary files from the build stage
# # For a simple app, this might be the entire /app directory
# COPY --from=build --chown=appuser:appgroup /app ./

# Define the entrypoint command

FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM prod-deps
COPY --from=build /app/client/dist /app/client/dist

ENV NODE_ENV="production"
ENV PORT=8080
ENV VITE_API_BASE=https://gr17-finalproject.brleu.com
ENV VITE_WS_URL=wss://gr17-finalproject.brleu.com/ws
ENV GITHUB_CALLBACK_URL=https://gr17-finalproject.brleu.com/auth/github/callback

EXPOSE 8080

CMD [ "pnpm", "start" ]