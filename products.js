import pagination from './pagination.js';

let productModal='';
let deleteModal='';




const app=Vue.createApp({
    data(){
        return{
            // 我的api站點跟路徑
            url:'https://vue3-course-api.hexschool.io/',
            path:'iven_vue3_course',
            // 把遠端取回來的資料，放我的data裡面
            allProducts:[],
            // 產品新增、修改、刪除時，暫存的地方
            tempProduct:{
                imagesUrl:[],
                imageUrl:''
            },
           
            // 取得產品列表時，也會夾帶分頁的資訊，取回分頁資訊存放的地方
            pagination:{},
        }
    },
    methods:{
        logOut(){
            document.cookie = `week3homeworkTK=; expires=; path=/`;
            window.location='login.html';
        },
        getProducts(page=1){
            axios.get(`${this.url}api/${this.path}/admin/products?page=${page}`)
                .then((res)=>{
                    console.log(res);
                    this.allProducts=res.data.products;
                    this.pagination=res.data.pagination;
                }).catch((err)=>{
                    console.log(err);
                })
        },
        openModal(isNew,item){
            // 可以用switch來進行判斷
            switch(isNew){
                case 'new':
                productModal.show();
                this.isNew=true;
                // 把modal打開時，要把tempProduct清空
                this.tempProduct={
                    // imagesUrl:[]
                }
                break;
                case 'edit':
                productModal.show();
                this.isNew=false;
                this.tempProduct={...item};
                break;
                case 'delete':
                this.tempProduct={...item};
                deleteModal.show();
                break;
            }
            
        },
        updateProduct(tempProduct){
            if(this.isNew){
                // post
                axios.post(`${this.url}api/${this.path}/admin/product`,{data:tempProduct})
                    .then((res)=>{
                        console.log(res);
                        productModal.hide();
                        this.getProducts();
                    }).catch((err)=>{
                        console.log(err);
                    })
            }else{
                // put
                axios.put(`${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`,{data:tempProduct})
                    .then((res)=>{
                        console.log(res);
                        productModal.hide();
                        this.getProducts();
                    }).catch((err)=>{
                        console.log(err);
                    })
            }
        },
        delProduct(tempProduct){
            // console.log(this.tempProduct);
            axios.delete(`${this.url}api/${this.path}/admin/product/${tempProduct.id}`)
                .then((res)=>{
                    if(res.data.success){
                        console.log(res);
                        alert(res.data.message);
                        this.getProducts();
                    }else{
                        console.log(res);
                        alert(res.data.message);
                    }
                }).catch((err)=>{
                    console.log(err);
                })
            deleteModal.hide();
        },
        
    },
    mounted() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)week3homeworkTK\s*\=\s*([^;]*).*$)|^.*$/,"$1");
        console.log(token);
        if(token){
            axios.defaults.headers.common['Authorization']=token;
            this.getProducts();
        }else{
            alert('帳號或密碼錯誤')
            window.location='login.html';
        };
        productModal=new bootstrap.Modal(document.querySelector('#productModal'));
        deleteModal=new bootstrap.Modal(document.querySelector('#deleteModal'));
        const fileInput=document.querySelector('#fileInput');
        
    },

    components:{
        pagination
    },
   
});
app.component('productModal',{
    props:['products'],
    data(){
        return{
            isNew:false,
            url:'https://vue3-course-api.hexschool.io/',
            path:'iven_vue3_course',
        }
    },
    template:`<div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
        <div class="modal-header text-white bg-dark">
            <h5 class="modal-title" id="productModalLabel">
                <span v-if="!isNew">新增產品</span>
                <span v-else>編輯產品</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="fileInput" class="form-check-label">主要圖片</label>
                        <input type="file" class="form-control" @change="uploadFile" id="fileInput">
                        <input type="text" class="form-control mt-2" v-model="products.imageUrl">
                        <img :src="products.imageUrl" class="img-fluid" alt="">
                    </div>
                    <div>多圖新增</div>
                    <div v-if="Array.isArray(products.imagesUrl)">
                    <div v-for="(image,index) in products.imagesUrl" :key="index">
                        <div class="form-group my-3">
                            <label for="">圖片網址</label>
                            <input type="text" class="form-control" placeholder="請輸入圖片連結" v-model="products.imagesUrl[index]">
                            
                        </div>
                        <img :src="image" class="img-fluid">
                    </div>
                        <div>
                            <button type="button" class="btn btn-outline-primary w-100" @click="products.imagesUrl.push('')">新增圖片</button>
                            <button type="button" class="btn btn-outline-danger my-1 w-100" @click="products.imagesUrl.pop()" :class="[{'disabled':products.imagesUrl.length==0}]">
                                 刪除圖片
                            </button>
                        </div>
                    </div>

                    <div v-else>
                        <button type="button" class="btn btn-primary w-100 my-2" @click="createdImages">新增陣列圖片</button>
                    </div>

                </div>      
                <div class="col-md-8">
                <label for="title">標題</label>
                <input type="text" id="title" class='form-control' v-model="products.title">
                <div class="row form-group">
                    <div class="col-6">
                    <label for="category">分類</label>
                    <input type="text" class='form-control' id='category' v-model="products.category">
                    </div>
                    <div class="col-6">
                    <label for="unit">單位</label>
                    <input type="text" class='form-control' id='unit' v-model="products.unit">
                    </div>
                    <div class="col-6">
                    <label for="origin_price">原價</label>
                    <input type="number" class='form-control' min='0' id='origin_price' v-model.number="products.origin_price">
                    </div>
                    <div class="col-6">
                    <label for="price">售價</label>
                    <input type="number" class='form-control' min='0' id='price' v-model.number="products.price">
                    </div>
                    <hr class='mt-3'>
                </div>
                
                <label for="description">產品描述</label>
                <textarea type="text" class="form-control" id="description" v-model="products.description"></textarea>
                
                <label for="content">內容說明</label>
                <textarea type="text" class="form-control" id="content" v-model="products.content"></textarea>
                
                <input type="checkbox" class="form-check-input" id="is_enabled" v-model="products.is_enabled">
                <label class="form-check-label" for="is_enabled" :true-value="1" :false-value="0">是否啟用</label>
                </div>
            </div>
            </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
            取消
            </button>
            <button type="button" class="btn btn-outline-primary btn-sm" @click="editProduct(products)">確認</button>
        </div>
        </div>
    </div>
</div>`,
    methods:{
        uploadFile(){
            // console.dir(fileInput.files[0]);
            const file=fileInput.files[0];
            // 以formData形式上傳 這個new FormData();會把要上傳的檔案，轉成以表單的形式發送
            const formData=new FormData();
            formData.append('file-to-upload',file);
            axios.post(`${this.url}api/${this.path}/admin/upload`,formData)
                .then((res)=>{
                    if(res.data.success){
                        this.products.imageUrl=res.data.imageUrl;
                        console.log(this.products.imageUrl);
                    }
                    
                })
        },
        createdImages(){
            this.products.imagesUrl=[''];
        },
        editProduct(products){
            this.$emit('renew-product',products)
        }
},


});

app.component('deleteProduct',{
    props:['deleteModal'],
    methods:{
        removeProduct(deleteModal){
            this.$emit('delete',deleteModal)
        }
    },
    template:`<div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModalLabel">刪除產品</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>確認要刪除<strong class="text-danger">{{deleteModal.title}}</strong>嗎？</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-outline-danger btn-sm" @click='removeProduct(deleteModal)'>確認刪除</button>
        </div>
      </div>
    </div>
  </div>`

});



app.mount('#app');