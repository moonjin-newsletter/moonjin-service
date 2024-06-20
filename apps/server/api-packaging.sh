source_folder="src/response/error"
destination_folder="../../packages/api-types/src/response/error"

# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress --exclude='error.ts' --exclude='errorInstances.ts' "$source_folder/" "$destination_folder/"


source_folder="src/auth/dto"
destination_folder="../../packages/api-types/src/api-types/auth/dto"

rm "$destination_folder/*"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/letter/dto"
destination_folder="../../packages/api-types/src/api-types/letter/dto"
rm "$destination_folder/*"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/post/dto"
destination_folder="../../packages/api-types/src/api-types/post/dto"
rm "$destination_folder/*"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/series/dto"
destination_folder="../../packages/api-types/src/api-types/series/dto"
rm "$destination_folder/*"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/user/dto"
destination_folder="../../packages/api-types/src/api-types/user/dto"
rm "$destination_folder/*"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/file/dto"
destination_folder="../../packages/api-types/src/api-types/file/dto"
rm "$destination_folder/*"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/mail/dto"
destination_folder="../../packages/api-types/src/api-types/mail/dto"
rm "$destination_folder/*"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/common/pagination/dto"
destination_folder="../../packages/api-types/src/api-types/common/pagination/dto"
rm "$destination_folder/*"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"


source_folder="src/writerInfo/dto"
destination_folder="../../packages/api-types/src/api-types/writerInfo/dto"
rm "$destination_folder/*"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/subscribe/dto"
destination_folder="../../packages/api-types/src/api-types/subscribe/dto"
rm "$destination_folder/*"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"

source_folder="src/newsletter/dto"
destination_folder="../../packages/api-types/src/api-types/newsletter/dto"
rm "$destination_folder/*"
# 원본 폴더 안의 모든 파일과 폴더를 대상 폴더로 복사
rsync -av --progress "$source_folder/" "$destination_folder/"


echo "복사가 완료되었습니다."
