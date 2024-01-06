import * as AllComponents from '@components';
import { ContentBox } from '@components';
import * as AllContainers from '@containers';
import { createTab } from '@plugins/Tabplugin';
import store from '@states/store';
import { useMenuStore, useUserStore } from '@stores';
import React from 'react';
import { Route } from 'react-router-dom';

const ComponentWrapper = (
  name,
  code,
  menuLevel,
  component,
  router,
  title,
  InputComponent,
  breadcrumb_array,
  languageKey
) => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        tabRender: createTab({
          is_reload_component: this.props.location.is_reload_component,
          component: component,
          title: title,
          name: String(name).toUpperCase(),
          code: code,
          menuLevel: menuLevel,
          router,
          breadcrumb_array,
          ChildComponent: InputComponent,
          languageKey,
        }),
      };
    }

    render() {
      return this.state.tabRender ? null : (
        <ContentBox title={name} code={code} languageKey={languageKey} breadcrumb={breadcrumb_array}>
          {InputComponent && <InputComponent />}
        </ContentBox>
      );
    }
  };

  // return (props) => {
  //   const [tabRender, setTabRender] = useState(null);

  //   useEffect(() => {
  //     // componentWillMount events
  //     const res = createTab({
  //       is_reload_component: props.location.is_reload_component,
  //       component: component,
  //       title: title,
  //       name: String(name).toUpperCase(),
  //       code: code,
  //       router,
  //       breadcrumb_array,
  //       ChildComponent: InputComponent,
  //     });
  //     setTabRender(res);
  //     console.log('aaaaa');
  //   }, [tabRender]);

  //   return tabRender ? null : (
  //     <ContentBox title={title} code={code} breadcrumb={breadcrumb_array}>
  //       {InputComponent && <InputComponent />}
  //     </ContentBox>
  //   );
  // };
};

// const ComponentWrapper = (name, code, component, router, title, InputComponent, breadcrumb_array) => {
//   const [tabRender, setTabRender] = useState(null);

//   useEffect(() => {
//     setTabRender(
//       createTab({
//         is_reload_component: props.location.is_reload_component,
//         component: component,
//         title: title,
//         name: String(name).toUpperCase(),
//         code: code,
//         router,
//         breadcrumb_array,
//         ChildComponent: InputComponent,
//       })
//     );
//   }, []);

//   return tabRender ? null : (
//     <ContentBox title={title} code={code} breadcrumb={breadcrumb_array}>
//       {InputComponent && <InputComponent />}
//     </ContentBox>
//   );
// };

const buildTreeMenu = (
  level,
  list,
  tree,
  parentId,
  breadcrumb_array,
  data,
  routers,
  Component_Show_Default,
  onlyHtml,
  breadcrumb_array_result
) => {
  let html_child = '';

  list.forEach((item) => {
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.menuId,

        children: [],
      };

      if (!parentId) {
        breadcrumb_array = [item.menuName];
        // breadcrumb_array = [<FormattedMessage id={item.languageKey} />]
      } else {
        breadcrumb_array.push(item.menuName);
        // breadcrumb_array.push(<FormattedMessage id={item.languageKey} />);
      }

      //Iterate the list to find all submenus that match the current menu
      let res_html = buildTreeMenu(
        level + 1,
        list,
        child.children,
        item.menuId,
        breadcrumb_array,
        data,
        routers,
        Component_Show_Default,
        onlyHtml,
        breadcrumb_array_result
      );

      // Delete properties with no children value
      let hasSub = false;
      if (child.children.length <= 0) {
        delete child.children;

        if (item.menuComponent && item.navigateUrl) {
          if (!onlyHtml) {
            routers.push(
              <Route
                key={item.menuId}
                path={item.navigateUrl}
                component={ComponentWrapper(
                  item.menuName, //name
                  item.menuComponent, //code
                  item.menuLevel,
                  item.menuComponent, //component
                  item.navigateUrl, //router
                  item.menuName, //title
                  AllContainers[item.menuComponent] || AllComponents[item.menuComponent], //InputComponent
                  [...breadcrumb_array],
                  item.languageKey
                )}
              />
            );
          } else {
            breadcrumb_array_result.push({
              title: item.menuName,
              code: item.menuComponent,
              breadcrumb: [...breadcrumb_array],
              name: item.menuName,
              path: item.navigateUrl,
            });
          }

          // if (item.isShowDefault === true && !Component_Show_Default.cmp) {
          //   Component_Show_Default.cmp = ComponentWrapper(
          //     item.menuComponent,
          //     item.menuComponent,
          //     item.menuId,
          //     item.menuComponent,
          //     item.navigateUrl,
          //     item.menuComponent,
          //     AllContainers[item.menuComponent] || AllComponents[item.menuComponent],
          //     [...breadcrumb_array]
          //   );
          // }

          breadcrumb_array.pop();

          html_child += `<li class="nav-item">
            <a href="#" router="${item.navigateUrl ?? ''}"  class="nav-link">
            <i class=" ${item.menuIcon} nav-icon"></i>
            <p>${item.menuName}</p> </a></li>
             `;
        }
      } else {
        // if (child.visiable !== true) {
        //   breadcrumb_array.pop();
        // }

        breadcrumb_array.pop();

        hasSub = true;
        res_html = '<ul class="nav nav-treeview sub-lever1">' + res_html + '</ul>';
      }

      tree.push(child);

      if (!parentId) {
        data.html +=
          ` <li class="nav-item ">
              <a href="#" router="${hasSub ? '' : item.navigateUrl}" class="nav-link" >
              <i class="nav-icon  ${item.menuIcon}"></i>
              <p>
                  ${item.menuName}
              ` +
          (hasSub ? '<i class="right fas fa-angle-left"></i>' : '') +
          `</p>
              </a> ` +
          res_html +
          '</li>';
      } else if (hasSub) {
        html_child += `<li class="nav-item">
              <a href="#" router=""  class="nav-link">
              <i class=" ${item.menuIcon} nav-icon"></i>
              <p>
                ${item.menuName}
                <i class="right fas fa-angle-left" style="margin-right:${level * 15}px;"></i>
              </p>
              </a>${res_html}</li>
               `;
      }
    }
  });
  return html_child;
};

const GetMenus_LoginUser = () => {
  const user = useUserStore.getState().user;

  const menuNav = [];
  const routers = [];
  const data = { html: '' };
  const Component_Show_Default = { cmp: null };
  let defaultUrl = '';
  const menu = useMenuStore.getState().menu;

  if (user) {
    store.dispatch({ type: 'Dashboard/USER_LOGIN' });
    // Backend data
    buildTreeMenu(
      0, //level
      menu, //list
      menuNav, //tree
      null, //parentId
      [], //breadcrumb_array
      data, //data
      routers, //routers
      Component_Show_Default //Component_Show_Default
    );
  }
  const defaultCpn = menu.filter((x) => x.menuComponent)[0];
  if (!Component_Show_Default.cmp) {
    Component_Show_Default.cmp = ComponentWrapper('', '', null, '', null, null, []);
  }
  if (defaultCpn) {
    //Component_Show_Default.cmp = ComponentWrapper('', '', null, '', null, null, []);
    Component_Show_Default.cmp = ComponentWrapper(
      defaultCpn.menuName, //name
      defaultCpn.menuComponent, //code
      defaultCpn.menuLevel,
      defaultCpn.menuComponent, //component
      defaultCpn.navigateUrl, //router
      defaultCpn.menuName, //title
      AllContainers[defaultCpn.menuComponent] || AllComponents[defaultCpn.menuComponent], //InputComponent
      []
    );
    defaultUrl = defaultCpn.navigateUrl;
  }

  return [menuNav, data.html, routers, user.fullName ?? user.userName, Component_Show_Default.cmp, defaultUrl];
};

const getMenuHtml = (menu) => {
  const user = useUserStore.getState().user;
  const data = { html: '' };
  const menuNav = [];
  const routers = [];
  const Component_Show_Default = { cmp: null };

  const breadcrumb_array = [];
  if (user) {
    if (!menu) {
      menu = useMenuStore.getState().menu;
    }
    buildTreeMenu(
      0, //level
      menu, //list
      menuNav, //tree
      null, //parentId
      [], //breadcrumb_array
      data,
      routers, //routers
      Component_Show_Default, //Component_Show_Default
      true,
      breadcrumb_array
    );
  }
  return {
    html: data.html,
    breadcrumb: breadcrumb_array,
  };
};

export { GetMenus_LoginUser, getMenuHtml };
