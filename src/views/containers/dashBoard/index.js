import { DashBoard } from '@components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CombineStateToProps, CombineDispatchToProps } from '@plugins/helperJS';
import { Dashboard_Operations } from '@appstate/dashBoard';
import { User_Operations } from '@appstate/user';
import { Store } from '@appstate';

Dashboard_Operations.toString = () => {
  return 'Dashboard_Operations';
};

User_Operations.toString = () => {
  return 'User_Operations';
};

const mapStateToProps = (state) => {
  const {
    User_Reducer: { language },
  } = CombineStateToProps(state.AppReducer, [[Store.User_Reducer]]);

  const {
    Dashboard_Reducer: { HistoryElementTabs, index_tab_active },
  } = CombineStateToProps(state.AppReducer, [[Store.Dashboard_Reducer]]);

  return {
    language,
    HistoryElementTabs,
    index_tab_active,
  };
};

const mapDispatchToProps = (dispatch) => {
  const {
    Dashboard_Operations: { updatenotify },
  } = CombineDispatchToProps(dispatch, bindActionCreators, [[Dashboard_Operations]]);

  return { updatenotify };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
