#!/bin/bash
target_folder="apps/server"

# source_folder에서 .env로 시작하는 파일을 찾아서 대상 폴더로 복사
cp .env* "$target_folder/.env"

target_folder="apps/client"

# source_folder에서 .env로 시작하는 파일을 찾아서 대상 폴더로 복사
cp .env* "$target_folder/.env"