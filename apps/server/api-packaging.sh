source_folder="src/response/error"
destination_folder="../../packages/api-types/src/response/error"

# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress --exclude='error.ts' --exclude='errorInstances.ts' "$source_folder/" "$destination_folder/"

echo "복사가 완료되었습니다."