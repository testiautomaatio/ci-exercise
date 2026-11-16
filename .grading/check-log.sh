#!/usr/bin/env bash

log_file=app/app.log
pattern="$1"
use_regex="${2:-false}"

if [[ "$use_regex" == "true" ]]; then
  # Use extended regex matching
  if grep -E -- "$pattern" "$log_file" > /dev/null; then
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
else
  # Use literal string matching
  if grep -F -- "$pattern" "$log_file" > /dev/null; then
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
fi
