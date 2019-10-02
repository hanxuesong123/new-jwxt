<template>
    <div>
        <Drawer v-model="value">
            123
        </Drawer>
    </div>
</template>

<script>
    export default {
        name: "read-upper-exam",
        data(){
            return {
                value : false,
                examData:{}
            }
        }
    }
</script>

<style scoped>

</style>