
import store from '@/store'

 const has_permission = (code) =>{
  return store.state.user.access.roles.points.join(",").includes(code) ? true : false;
};

const has_api_permission = code =>{
    return store.state.user.access.roles.apis.join(",").includes(code) ? true : false;
}

/*const toggleFullScreen = () => {
    if (!document.fullscreenElement &&
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
};*/

export default {
  has_permission,has_api_permission
};
