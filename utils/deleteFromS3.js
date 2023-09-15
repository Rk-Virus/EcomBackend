const aws = require('aws-sdk');

const deleteFromS3 = (objects) => {
    const s3 = new aws.S3({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_BUCKET_REGION
    })
    console.log({objects})
    const objectsToBeDeleted = objects.map((item) => ({ Key: item.split(".com/")[1] }))
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Delete: {
            Objects: objectsToBeDeleted
        }
    }
    console.log("params",objectsToBeDeleted)
    return new Promise((resolve, reject) => {
        s3.deleteObjects(params, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(data)
            }
        })
    })
   
}

module.exports = deleteFromS3