const app={
    data(){
        return{
            url:'https://vue3-course-api.hexschool.io/',
            path:'iven_vue3_course',
            account:'',
            password:''
        }
    },
    methods:{
        login(){
            const user={
                username:this.account,
                password:this.password
            };
            axios.post(`${this.url}admin/signin`,user)
                .then((res)=>{
                    if(res.data.success){
                        alert('登入成功');
                        window.location='products.html';
                        // console.log(res);
                        const token = res.data.token;
                        const expired = res.data.expired;
                        // console.log(token,expired);
                        document.cookie = `week3homeworkTK=${token}; expires=${new Date(expired)}; path=/`;

                    }else{
                        alert('帳號或密碼錯誤');
                        console.log(res);
                    }
                }).catch((err)=>{
                    console.log(err);
                })
        }
    }
}

Vue.createApp(app).mount('#app');