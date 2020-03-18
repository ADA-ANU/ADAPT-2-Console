const PROD_ROOT = '/'
const DEV_ROOT = 'http://localhost:3000/'

const PROD_API_URL = {
    ROOT_URL: PROD_ROOT,
    SITE: PROD_ROOT+'site',
    QUERY_SITE: PROD_ROOT+'query'
}
const DEV_API_URL = {
    ROOT_URL: DEV_ROOT,
    SITE: DEV_ROOT+'site',
    QUERY_SITE: DEV_ROOT+'api/'
}
let API_URL = PROD_API_URL

process.env.REACT_APP_MODE==='dev' ? API_URL = DEV_API_URL : API_URL = PROD_API_URL

export default API_URL