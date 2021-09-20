export const beforeUploadImg = function(img) {
    let imgEndType = img.name.substring(img.name.lastIndexOf('.') + 1)
    imgEndType = imgEndType.toLowerCase()
    if (imgEndType !== 'jpg' && imgEndType !== 'jpeg' && imgEndType !== 'png') {
        this.$Notice.error({
            title: `图片必须是jpg或者png格式`,
            duration: 3
        })
        return false
    }
    const sizeNum = 5
    if (img.size > sizeNum * 1024 * 1024) {
        this.$Notice.error({
            title: `图片大小不能超过${sizeNum}M`,
            duration: 3
        })
        return false
    }
}

export const beforeUploadFile = function(img) {
    const sizeNum = 100
    if (img.size > sizeNum * 1024 * 1024) {
        this.$Notice.error({
            title: `文件大小不能超过${sizeNum}M`,
            duration: 3
        })
        return false
    }
}
