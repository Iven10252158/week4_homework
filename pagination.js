export default{
    template:`<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{'disabled': page.current_page===1}">
        <a class="page-link" href="#" aria-label="Previous"
        @click="getEmit(page.current_page -1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" :class="{'active':item === page.current_page}"
      v-for="(item,index) in page.total_pages" :key="item">
        <a class="page-link" href="#"   @click="getEmit(item)">{{item}}</a>
      </li>
      <li class="page-item" :class="{'disabled': page.current_page===page.total_pages}">
        <a class="page-link" href="#" aria-label="Next"
        @click="getEmit(page.current_page +1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,
  props:['page'],
  methods:{
    getEmit(item){
        this.$emit('useEmit',item)
        console.log('按到emit囉！');
        
    }
  },

  
}