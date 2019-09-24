<template>
    <Drawer v-model="value" :width="800" :closable="false">
        <Form ref="form" :model="studentObject" :rules="rules" :label-width="80">
            <FormItem prop="nickName" label="姓名">
                <Input type="text" placeholder="请输入姓名" v-model="studentObject.nickName" />
            </FormItem>
            <FormItem prop="telephone" label="电话">
                <Input type="text" placeholder="请输入电话" v-model="studentObject.telephone" />
            </FormItem>
            <FormItem prop="email" label="E-mail">
                <Input type="text" placeholder="请输入E-mail" v-model="studentObject.email" />
            </FormItem>
            <FormItem prop="sex" label="性别">
                <RadioGroup v-model="studentObject.sex" placeholder="请选择教师性别">
                    <Radio label="1">男</Radio>
                    <Radio label="2">女</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem prop="residenceAddress" label="户籍">
                <Input type="text" placeholder="请输入户籍" v-model="studentObject.residenceAddress" />
            </FormItem>
            <FormItem prop="nowAddress" label="现住址">
                <Input type="text" placeholder="请输入户籍" v-model="studentObject.nowAddress" />
            </FormItem>
            <FormItem prop="idCard" label="身份证">
                <Input type="text" placeholder="请输入身份证" v-model="studentObject.idCard" />
            </FormItem>
            <FormItem prop="birthday" label="生日">
                <DatePicker type="date" v-model="studentObject.birthday" placeholder="请选择生日" style="width: 162px;"></DatePicker>
            </FormItem>
            <FormItem prop="education" label="学历" placeholder="请选择学历" >
                <Select v-model="studentObject.education" style="width: 162px;">
                    <Option :value="'1'">初中</Option>
                    <Option :value="'2'">高中</Option>
                    <Option :value="'3'">中专</Option>
                    <Option :value="'4'">大专</Option>
                    <Option :value="'5'">本科</Option>
                </Select>
            </FormItem>
            <FormItem prop="graduationSchool" label="毕业院校">
                <Input type="text" placeholder="请输入毕业院校" v-model="studentObject.graduationSchool" />
            </FormItem>
            <FormItem prop="major" label="专业">
                <Select v-model="studentObject.major" placeholder="请选择专业" style="width: 162px;">
                    <Option :value="'1'">计算机专业</Option>
                    <Option :value="'2'">其他专业</Option>
                </Select>
            </FormItem>
            <FormItem prop="emergencyContact" label="紧急联络">
                <Input type="text" placeholder="请输入紧急联系人+电话" v-model="studentObject.emergencyContact" />
            </FormItem>
            <FormItem prop="relation" label="关系">
                <Input type="text" placeholder="请输入紧急联系人+电话" v-model="studentObject.relation" />
            </FormItem>

            <div class="demo-drawer-footer">
                <Button type="primary" icon="md-add" @click="handleSubmit('form')">提交</Button>
            </div>
        </Form>
    </Drawer>
</template>

<script>

    import { only_chinese,validate_telephone,validate_email,validate_id_card } from "@/utils/validate/commons/commons_validate";

    import { saveOrUpdate } from "@/api/quality/student";

    export default {
        name: "add-edit-student",
        props:{
          nickNameRules:{
              type:Array,
              default:()=>{
                  return [
                      {validator:only_chinese,trigger:'blur'}
                  ]
              }
          },
            telephoneRules:{
              type:Array,
                default:()=>{
                    return [
                        {validator: validate_telephone,trigger: "blur"}
                    ]
                }
            },
            emailRules:{
                type:Array,
                default:()=>{
                    return [
                        {validator: validate_email,trigger: "blur"}
                    ]
                }
            },
            sexRules:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必选项',trigger: "change"}
                    ]
                }
            },
            residenceAddressRules:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必输项',trigger: "blur"}
                    ]
                }
            },
            nowAddressRules:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必输项',trigger: "blur"}
                    ]
                }
            },
            idCardRules:{
                type:Array,
                default:()=>{
                    return [
                        {validator:validate_id_card,trigger: "blur"}
                    ]
                }
            },
            birthdayRules:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必输项',trigger: "blur",type:'date'}
                    ]
                }
            },
            educationRules:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必输项',trigger: "change"}
                    ]
                }
            },
            graduationSchoolRules:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必输项',trigger: "blur"}
                    ]
                }
            },
            majorRules:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必输项',trigger: "change"}
                    ]
                }
            },
            emergencyContactRules:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必输项',trigger: "blur"}
                    ]
                }
            },
            relationRules:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必输项',trigger: "blur"}
                    ]
                }
            }
        },
        data(){
            return {
                value : false,
                studentObject :{}
            }
        },
        computed:{
            rules(){
                return {
                    nickName:this.nickNameRules,
                    telephone: this.telephoneRules,
                    email:this.emailRules,
                    sex: this.sexRules,
                    residenceAddress: this.residenceAddressRules,
                    nowAddress : this.nowAddressRules,
                    idCard: this.idCardRules,
                    birthday:this.birthdayRules,
                    education:this.educationRules,
                    graduationSchool:this.graduationSchoolRules,
                    major:this.majorRules,
                    emergencyContact:this.emergencyContactRules,
                    relation:this.relationRules
                }
            }
        },
        methods:{
            handleSubmit(name){
                this.$refs[name].validate(valid=>{
                    if(valid){
                        saveOrUpdate(this.studentObject).then(res=>{
                           this.$Message.info(res.data.message);
                           this.value = false;
                           this.$parent.getStudentList(this.$parent.params);
                        })
                    }else{
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .demo-drawer-footer{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>