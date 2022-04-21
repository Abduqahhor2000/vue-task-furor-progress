<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
      <div class="container">
        <a class="navbar-brand" href="#">Product</a>
        <div class="d-flex justifiy-content-between">
          <div></div>
          <div class="d-flex lalula">
            <div @click="IsModalOpen" class="btn btn-success text-white mx-2">Add Product</div>
            <input class="form-control me-2" type="search" placeholder="Search..." aria-label="Search">
          </div>
        </div>
      </div>
    </nav>

    <div class="container">
      <table class="table table-striped table-hover">
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
            <td>{{product.created_date}}</td>
            <td>
              <div @click="editButtonFunc(product)" class="btn btn-primary text-white btn-sm mx-2">Edit</div>
              <div @click="deleteProduct(product.id)" class="btn btn-danger text-white btn-sm">Delete</div>
            </td>
         </tr>
        </tbody>
      </table>
    </div> 

    <div class="container d-flex justify-content-center">
      <div class="w-auto d-flex justify-content-between">
        <div @click="changePage('next')">
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
        <div @click="changePage('back')">
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
        totalPages: 0,
        truePage: 1,
        limitItems: 10,
        
        id: 0,
        product_type_id: 0,
        name_uz: "",
        cost: 0,
        address: "",

        isModalOpen: false,
        isAddOpen: false,
      }
    },
    methods:{
        IsModalOpen(){
          this.isModalOpen = true
          this.isAddOpen = true
        },

        async getProducts(){
          try{
            const response = await axios.get("/api/product", {
              params:{
                page: this.truePage,
                perPage: this.limitItems,
              }
            })
            if(response.data.length === 0){
                this.truePage -= 1
                this.getProducts()
                return;
            }
            this.products = response.data
          }catch(err){
            console.log(err)
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
            this.getProducts()
          }catch(err){
            console.log("error", err)
          }
        },

        changePage(number){
          if(number === "next"){
            if(this.truePage > 1){
              this.truePage -= 1
              this.getProducts()
            }
            return;
          }else if(number === "back"){
            if(this.truePage < this.totalPages){
              this.truePage += 1
              this.getProducts()
            }
            return;
          }
          this.truePage = number;
          this.getProducts()
        },

        async getTotalPage(){
          try{
            const response = await axios.get("/api/product")
            this.totalPages = Math.ceil(response.data.length / this.limitItems)
          }catch(err){
            console.log(err)
          }
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
</style>

<style>
/* <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li> */
</style>
