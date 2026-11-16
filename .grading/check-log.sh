#!/usr/bin/env bash

log_file=app/app.log

if grep -F -- "$1" "$log_file" > /dev/null; then
  printf 'Success!'
else
  result=$?
  if [[ $result -eq 1 ]]; then
    printf 'Failure: this scenario was not found in the application logs.\n' >&2
  else
    printf 'Could not search %s.\n' "$log_file" >&2
  fi
  exit "$result"
fi
