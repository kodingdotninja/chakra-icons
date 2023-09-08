#!/usr/bin/env bash

INCLUDE_FILES=(
  tsconfig.json
  tsup.config.ts
)

for dir in packages/@chakra-icons/*; do
  for file in "${INCLUDE_FILES[@]}"; do
    cp templates/@chakra-icons/$file $dir
  done
done
