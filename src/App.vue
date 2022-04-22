<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
      <div class="container">
        <a class="navbar-brand" href="#">Product</a>
        <div class="d-flex justifiy-content-between">
          <div></div>
          <div class="d-flex lalula">
            <div @click="IsModalOpen" class="btn btn-success text-white mx-2">Add Product</div>
            <input v-model="searchName" class="form-control me-2" type="search" placeholder="Search..." aria-label="Search">
          </div>
        </div>
      </div>
    </nav>

    <div  class="container table-c">
      <table v-if="!isLoading" class="table table-striped table-hover">
        <thead>
          <td class="px-2">ID</td>
          <td class="px-2">Type ID</td>
          <td class="px-2">Name</td>
          <td class="px-2">Cost</td>
          <td class="px-2">Address</td>
          <td class="px-2">Create Date</td>
          <td class="px-2">Change</td>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{product.id}}</td>
            <td>{{product.product_type_id}}</td>
            <td>{{product.name_uz}}</td>
            <td>{{product.cost}}</td>
            <td>{{product.address}}</td>
            <td>{{farmatDate(product.created_date)}}</td>
            <td>
              <div @click="editButtonFunc(product)" class="btn btn-primary text-white btn-sm mx-2">Edit</div>
              <div @click="deleteProduct(product.id)" class="btn btn-danger text-white btn-sm">Delete</div>
            </td>
         </tr>
        </tbody>
      </table>
      <div v-else-if="isLoading" class="d-flex justify-content-center">
        <div class="spinner-grow text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-secondary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <div class="container d-flex justify-content-center mt-3">
      <div class="w-auto d-flex justify-content-between">
        <div @click="changePage('back')">
          <div class="btn btn-outline-primary mx-1">
            {{"<<"}}
          </div>
        </div>
        <div @click="changePage(pagebutton)"
              class="d-none"
             :class="{'d-block' : (pagebutton <= (truePage + 5)) && (pagebutton >= (truePage - 5)) || (pagebutton === totalPages) || (pagebutton === 1)}"
             v-for="pagebutton in totalPages"
             :key="pagebutton.id">
          <div class="btn btn-outline-primary mx-1"
               :class="{'btn-primary text-white' : pagebutton === truePage}">
            {{pagebutton}}                
          </div>
        </div>
        <div @click="changePage('next')">
          <div class="btn btn-outline-primary mx-1">
            {{">>"}}
          </div>
        </div>
      </div>
    </div>

    <modal v-model:isModalOpen="isModalOpen" :isModalOpen="isModalOpen">
      <label for="producttype" class="form-label">Product Type:</label>
      <select class="form-select" v-model="product_type_id" id="producttype">
        <option disabled :value="0"></option>
        <option :value="1">Yovvoyi xayvonlar</option>
        <option :value="2">Daraxtlar</option>
        <option :value="3">O'simliklar</option>
      </select>
      <label for="input1" class="form-label mt-3">Product Name:</label>
      <input type="text" class="form-control" id="input1" v-model="name_uz">
      <label for="input2" class="form-label mt-3">Cost:</label>
      <input type="number" class="form-control" id="input2" v-model="cost">
      <label for="input3" class="form-label mt-3">Address:</label>
      <input type="text" class="form-control" id="input3" v-model="address">
      <div v-if="isAddOpen" class="d-flex justify-content-end">
        <div @click="addProduct" class="w-auto btn btn-primary text-white mt-5">Add Product</div>
      </div>
      <div v-else class="d-flex justify-content-end">
        <div @click="editProduct" class="w-auto btn btn-success text-white mt-5">Edit Product</div>
      </div>
    </modal>
   
</template>

<script>
  import axios from "axios"
  import Modal from "@/modal/Modal.vue"

  export default {
    components:{
      Modal,
    },
    data(){
      return{
        products: [],
        searchName: "",
        totalPages: 0,
        truePage: 2,
        limitItems: 10,
        
        id: 0,
        product_type_id: 0,
        name_uz: "",
        cost: 0,
        address: "",

        isModalOpen: false,
        isAddOpen: false,

        isLoading: false,
      }
    },
    methods:{
        IsModalOpen(){
          this.isModalOpen = true
          this.isAddOpen = true
        },

        async getProducts(){
          this.isLoading = true
          try{
            const response = await axios.get("/api/product", {
              params:{
                page: this.truePage,
                perPage: this.limitItems,
              }
            })
            if(response.data.length === 0 && this.truePage > 1){
                this.truePage -= 1 
                this.getProducts()
            }
            this.products = response.data
            this.isLoading = false
          }catch(err){
            console.log(err)
            this.isLoading = false
          }
        },
        async deleteProduct(id){
          try{
            const response = await axios.delete(`/api/product/${id}`)
            console.log("access", response)
            this.getProducts()
            this.getTotalPage()
          }catch(err){
            console.log("error", err)
          }
        },
        async addProduct(){
          try{
            const response = await axios.post(`/api/product/`, 
              {
                product_type_id: this.product_type_id,
                name_uz: this.name_uz,
                cost: this.cost,
                address: this.address,
                created_date: new Date(),
              }
            )
            console.log("access", response)
            this.getProducts()
            this.isModalOpen = false
            this.isAddOpen = false
            this.product_type_id = 0
            this.name_uz = ""
            this.cost = 0
            this.address = ""
          }catch(err){
            console.log("error", err)
          }
        },
        editButtonFunc(product){
          this.product_type_id = product.product_type_id
          this.name_uz = product.name_uz
          this.cost = product.cost
          this.address = product.address
          this.id = product.id
          this.isModalOpen = true
          this.isAddOpen = false
        },
        async editProduct(){
          try{
            const response = await axios.put(`/api/product/`, 
              { 
                id: this.id,
                product_type_id: this.product_type_id,
                name_uz: this.name_uz,
                cost: this.cost,
                address: this.address,
                created_date: new Date(),
              }
            )
            console.log("access", response)
            this.getProducts()
            this.isModalOpen = false
            this.product_type_id = 0
            this.name_uz = ""
            this.cost = 0
            this.address = ""
          }catch(err){
            console.log("error", err)
          }
        },

        changePage(number){
          if(number >= 1){
            this.truePage = number;
            this.getProducts()

          } else if(number === "next" && this.truePage < this.totalPages){
              this.truePage += 1
              this.getProducts()
            
          } else if(number === "back" && this.truePage > 1){
              this.truePage -= 1
              this.getProducts()
          } 
          console.log(this.truePage)
        },

        async getTotalPage(){
          try{
            const response = await axios.get("/api/product")
            this.totalPages = Math.ceil(response.data.length / this.limitItems)
          }catch(err){
            console.log(err)
          }
        },
        farmatDate(date) {
          const date1 = new Date(date)
          const date2 = date1.getDate()
          const date3 = date1.getFullYear()
          const date4 = date1.getHours()
          const date5 = date1.getMinutes()
          const date6 = date1.getMonth()
          return `${date4}:${date5} ${date2}-${
              date6 === 0 ? "Yanvar"
            : date6 === 1 ? "Febral"
            : date6 === 2 ? "Mart"
            : date6 === 3 ? "Aprel"
            : date6 === 4 ? "May"
            : date6 === 5 ? "Iyun"
            : date6 === 6 ? "Iyul"
            : date6 === 7 ? "Avgust"
            : date6 === 8 ? "Sentabr"
            : date6 === 9 ? "Oktiyabr"
            : date6 === 10 ? "Noyabr"
            : date6 === 11 ? "Dekabr" : null
          } ${date3}`
        }
    },
    mounted(){
      this.getTotalPage()
      this.getProducts();
    }
  }
</script>
 

<style>
  .lalula{
    height: 40px;
    width: 400px;
    justify-content: flex-end;
  }

  .lalula input{
    width: 250px;
  }

  .d-block{
    display: block !important;
  }
  .table-c{
    min-height: 510px;
  }
</style>


