source_folder="src/response/error"
destination_folder="../../packages/api-types/src/response/error"

# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress --exclude='error.ts' --exclude='errorInstances.ts' "$source_folder/" "$destination_folder/"


source_folder="src/auth/dto"
destination_folder="../../packages/api-types/src/api-types/auth/dto"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/letter/dto"
destination_folder="../../packages/api-types/src/api-types/letter/dto"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/post/dto"
destination_folder="../../packages/api-types/src/api-types/post/dto"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/series/dto"
destination_folder="../../packages/api-types/src/api-types/series/dto"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/user/dto"
destination_folder="../../packages/api-types/src/api-types/user/dto"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

echo "복사가 완료되었습니다."
