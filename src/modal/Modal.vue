<template>
    <div @click="hideEditModal" v-if="isModalOpen" class="modal-wrapper">
        <div @click.stop class="modal-chik">
            <slot></slot>
        </div>
    </div>
</template>

<script>

export default {
    props:{
        isModalOpen: {
            type: Boolean,
            default: false,
        }
    },
    methods:{
        hideEditModal(){
            this.$emit("update:isModalOpen", false)
        }
    }
}

</script>

<style>
    .modal-wrapper {
        display: flex;
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10;
        top: 0;
        left: 0;
    }

    .modal-chik{
        margin: auto;
        width: 50%;
        min-height: 100px;
        border-radius: 10px;
        background-color: #fff;
        padding: 20px;
    }
</style>