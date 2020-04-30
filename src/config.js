const PROD_ROOT = '/'
const DEV_ROOT = 'http://localhost:3000/'
var ROOT = process.env.REACT_APP_MODE==='dev' ? DEV_ROOT : PROD_ROOT

const API_URL = {
    ROOT_URL: ROOT,
    //SITE: ROOT+'site',
    QUERY_SITE: ROOT+'api/',
    Authenticate: ROOT + 'api/authenticate',
    Logout: ROOT + 'api/logout',
    Site: ROOT + 'api/site',
    Ada_FolderList: ROOT + 'api/adaFolderList',
    Get_ServerList: ROOT +'api/getServerList/',
    AdaID: ROOT + 'api/adaID',
    Create_ADAdataset: ROOT + 'api/createADAdataset',
    Get_DatasetInfo: ROOT + 'api/getDatasetInfo',
    Get_DataverseLists: ROOT + 'api/getDataverseLists',
    Download_Dataset_Files: ROOT+'api/downloadDatasetFiles',
    Get_Dataset_FileList_ByDOI:ROOT+'api/getDatasetFileListByDOI',
    Get_Subjects: ROOT +'api/getSubjects',
    Delete_Img: ROOT +'api/deleteImg/'
}

// const PROD_API_URL = {
//     ROOT_URL: PROD_ROOT,
//     SITE: PROD_ROOT+'site',
//     QUERY_SITE: PROD_ROOT+'api/',
//     Download_Dataset_Files: PROD_ROOT+'api/downloadDatasetFiles',
//     Get_Dataset_FileList_ByDOI:PROD_ROOT+'api/getDatasetFileListByDOI'
// }
// const DEV_API_URL = {
//     ROOT_URL: DEV_ROOT,
//     SITE: DEV_ROOT+'site',
//     QUERY_SITE: DEV_ROOT+'api/',
//     Download_Dataset_Files: DEV_ROOT+'api/downloadDatasetFiles',
//     Get_Dataset_FileList_ByDOI:DEV_ROOT+'api/getDatasetFileListByDOI'
// }
// let API_URL = PROD_API_URL

//process.env.REACT_APP_MODE==='dev' ? API_URL = DEV_API_URL : API_URL = PROD_API_URL

export default API_URL