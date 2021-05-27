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
        createImages(){
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
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
        
    },
};
Vue.createApp(app).mount('#app');