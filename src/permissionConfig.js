const PERMISSION_CATEGORY = {
    ADD_DV:'AddDataverse',
    ADD_DS: {
        type: 'AddDataset',
        errorMsg: "Sorry, you don't have permission to add a dataset "
    },
    VIEW_UNPUBLISHED_DV:{
        type:'ViewUnpublishedDataverse',
        errorMsg: "Sorry, you don't have permission to view files "
    } ,
    VIEW_UNPUBLISHED_DS: 'ViewUnpublishedDataset',
    DOWNLOAD_FILE:{
        type: 'DownloadFile',
        errorMsg: "Sorry, you don't have permission to download files "
    },
    EDIT_DV: 'EditDataverse',
    EDIT_DS: 'EditDataset',
    MANAGE_DV_PERMISSIONS: 'ManageDataversePermissions',
    MANAGE_DS_PERMISSIONS: 'ManageDatasetPermissions',
    PUBLISH_DV: 'PublishDataverse',
    PUBLISH_DS: 'PublishDataset',
    DELETE_DV: 'DeleteDataverse',
    DELETE_DS: 'DeleteDatasetDraft',

}


export default PERMISSION_CATEGORY