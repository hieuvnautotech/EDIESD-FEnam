import { DashBoard, Login } from '@containers';
import { historyApp } from '@utils';
import { AuthenticateRoute, LogoutRoute, NotAuthenticateRoute } from '@utils/Authenticate';
import CustomRouter from '@utils/CustomRoutes';
import React, { Component, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
// import OneSignal from 'react-onesignal';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để hiển thị UI thay thế khi có lỗi xảy ra
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Ghi lại thông tin lỗi, có thể gửi báo cáo lỗi đến một dịch vụ lỗi
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Hiển thị UI thay thế khi có lỗi xảy ra
      return (
        <div className="error-component">
          <div className="error-header"></div>
          <div className="container">
            <section className="error-container text-center">
              <h1>ERROR CODE 500</h1>
              <div className="error-divider">
                <h2>ooops!!</h2>
                <p className="description">SOMETHING WENT WRONG.</p>
              </div>
              <a href="/" className="return-btn" style={{ backgroundColor: '#ff1493' }}>
                <i className="fa fa-arrow-circle-left"></i>&nbsp;Back to home page
              </a>
            </section>
          </div>
        </div>
      );
    }

    // Hiển thị các component con bên trong ErrorBoundary
    return this.props.children;
  }
}

const RouteWrapperLogin = (props) => {
  const ComponentWrapper = NotAuthenticateRoute(Login, '/');
  return <ComponentWrapper {...props} />;
};

const RouteWrapperRoot = (props) => {
  const ComponentWrapper = AuthenticateRoute(DashBoard, '/login');

  return <ComponentWrapper {...props} />;
};

const RouteWrapperLogout = (props) => {
  const ComponentWrapper = LogoutRoute();
  return <ComponentWrapper {...props} />;
};

// class App extends Component {
//   handlePersistorState = () => {
//     const { persistor } = this.props;

//     let { bootstrapped } = persistor.getState();
//     if (bootstrapped) {
//       if (this.props.onBeforeLift) {
//         Promise.resolve(this.props.onBeforeLift())
//           .then(() => this.setState({ bootstrapped: true }))
//           .catch(() => this.setState({ bootstrapped: true }));
//       } else {
//         this.setState({ bootstrapped: true });
//       }
//     }
//   };

//   componentDidMount() {
//     this.handlePersistorState();
//   }

//   render() {
//     return (
//       <Fragment>
//         {/* <QueryClientProvider client={queryClient}> */}
//         <CustomRouter history={historyApp}>
//           <Switch>
//             <Route exact path="/login" component={RouteWrapperLogin} />
//             <Route exact path="/logout" component={RouteWrapperLogout} />

//             <Route path="/" render={() => <RouteWrapperRoot />} />
//           </Switch>
//         </CustomRouter>
//         {/* </QueryClientProvider> */}
//       </Fragment>
//     );
//   }
// }

const App = (props) => {
  window.OneSignal = window.OneSignal || [];

  const { persistor } = props;
  const [bootstrapped, setBootstrapped] = useState(false);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handlePersistorState = async () => {
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      try {
        if (props.onBeforeLift) {
          await Promise.resolve(props.onBeforeLift());
        }
        setBootstrapped(true);
      } catch (error) {
        setBootstrapped(true);
      }
    }
  };

  useEffect(() => {
    handlePersistorState();
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <React.Fragment>
      <ErrorBoundary>
        <CustomRouter history={historyApp}>
          <Switch>
            <Route exact path="/login" component={RouteWrapperLogin} />
            <Route exact path="/logout" component={RouteWrapperLogout} />
            <Route path="/" render={() => <RouteWrapperRoot />} />
          </Switch>
        </CustomRouter>
      </ErrorBoundary>
    </React.Fragment>
  );
};

export default App;
