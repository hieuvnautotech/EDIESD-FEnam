import { api_get, api_post, SuccessAlert, ErrorAlert } from '@utils';

var clicks = 0;
var timer = null;
var current_uid;

const api_post_prevent_doubleclick = (url, data, callback) => {
  clicks++;

  if (clicks === 1) {
    current_uid = generateUID();
    var uid = current_uid;

    timer = setTimeout(() => {
      if (callback) {
        new Promise((Resolve, Reject) => {
          // $('.ajaxloading').show();

          api_post(url, data)
            .then((res) => {
              // clicks = 0;
              if (uid == current_uid) {
                // $('.ajaxloading').hide();
              }
              //   console.log(res)
              //if (res.success) {

              Resolve('');
              if (uid == current_uid) {
                callback(res);
              }

              //  } else Reject("");
            })
            .catch((error) => {
              Reject('');
            });
        });
      }
      clicks = 0;
    }, 350);
  } else {
    clearTimeout(timer); //prevent single-click action
    //  alert("Double Click");  //perform double-click action
    clicks = 0; //after action performed, reset counter
  }
};

const api_get_prevent_doubleclick = (url, data, node_fancytree, callback) => {
  clicks++;

  if (clicks === 1) {
    current_uid = generateUID();
    var uid = current_uid;

    timer = setTimeout(() => {
      if (callback) {
        new Promise((Resolve, Reject) => {
          // $('.ajaxloading').show();
          if (node_fancytree) {
            var title_node = node_fancytree.title;
            var isFinish = false;
            var title_set_loading = false;
            setTimeout(() => {
              if (isFinish) return;

              node_fancytree.title = `<div>
                        <span >${title_node}</span>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </div>
                        `;
              node_fancytree.renderTitle();
              title_set_loading = true;
            }, 800);
          }

          api_get(url, data)
            .then((res) => {
              isFinish = true;
              if (uid == current_uid) {
                if (title_set_loading)
                  setTimeout(() => {
                    node_fancytree.title = `<span >${title_node}</span>`;
                    node_fancytree.renderTitle();
                  }, 200);
                // $('.ajaxloading').hide();
              }

              Resolve('');
              if (uid == current_uid) {
                callback(res);
              }

              //  } else Reject("");
            })
            .catch((error) => {
              if (title_set_loading)
                setTimeout(() => {
                  node_fancytree.title = `<span >${title_node}</span>`;
                  node_fancytree.renderTitle();
                }, 200);
              Reject('');
            });
        });
      }
      clicks = 0;
    }, 350);
  } else {
    clearTimeout(timer);
    clicks = 0;
  }
};

const generateUID = () => {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ('000' + firstPart.toString(36)).slice(-3);
  secondPart = ('000' + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
};

export { api_post_prevent_doubleclick, api_get_prevent_doubleclick };
