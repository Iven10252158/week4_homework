let productModal='';
let deleteModal='';

const app={
    data(){
        return{
            url:'https://vue3-course-api.hexschool.io/',
            path:'iven_vue3_course',
            allProducts:[],
            tempProduct:{
                imageUrl:[]
            },
            isNew:false

        }
    },
    methods:{
        logOut(){
            document.cookie = `week3homeworkTK=; expires=; path=/`;
            window.location='login.html';
        },
        getProducts(){
            axios.get(`${this.url}api/${this.path}/admin/products/all`)
                .then((res)=>{
                    this.allProducts=res.data.products;
                    console.log(res);
                    console.log(this.allProducts);
                    
                })
        },
        openModal(isNew,item){
            // 可以用switch來進行判斷
            switch(isNew){
                case 'new':
                productModal.show();
                this.isNew=true;
                this.tempProduct={
                    imageUrl:[]
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
        updateProduct(){
            if(this.isNew){
                // post
                axios.post(`${this.url}api/${this.path}/admin/product`,{data:this.tempProduct})
                    .then((res)=>{
                        console.log(res);
                        productModal.hide();
                        this.getProducts();
                    })
            }else{
                // put
                axios.put(`${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`,{data:this.tempProduct})
                    .then((res)=>{
                        console.log(res);
                        productModal.hide();
                        this.getProducts();
                    })
            }
        },
        delProduct(){
            console.log(this.tempProduct);
            axios.delete(`${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`)
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
        uploadFile(){
            // console.dir(fileInput.files[0]);
            const file=fileInput.files[0];
            // 以formData形式上傳 這個new FormData();會把要上傳的檔案，轉成以表單的形式發送
            const formData=new FormData();
            formData.append('file-to-upload',file);
            axios.post(`${this.url}api/${this.path}/admin/upload`,formData)
                .then((res)=>{
                    if(res.data.success){
                        this.tempProduct.imageUrl=res.data.imageUrl;
                        console.log(this.tempProduct.imageUrl);
                    }
                    
                })
        }
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
};
Vue.createApp(app).mount('#app');