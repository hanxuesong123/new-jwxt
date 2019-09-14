
import store from '@/store'

 const has_permission = (code) =>{
  return store.state.user.access.roles.points.join(",").includes(code) ? true : false;
};

export default {
  has_permission
};
