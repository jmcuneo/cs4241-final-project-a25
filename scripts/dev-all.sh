#!/usr/bin/env bash
pnpm install
pnpm --filter server install
pnpm --filter client install
pnpm dev
