"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TextLayerInternal = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _pdfjsDist = _interopRequireDefault(require("pdfjs-dist"));

var _DocumentContext = _interopRequireDefault(require("../DocumentContext"));

var _PageContext = _interopRequireDefault(require("../PageContext"));

var _utils = require("../shared/utils");

var _propTypes2 = require("../shared/propTypes");

var TextLayerInternal =
/*#__PURE__*/
function (_PureComponent) {
  (0, _inherits2.default)(TextLayerInternal, _PureComponent);

  function TextLayerInternal() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, TextLayerInternal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(TextLayerInternal)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      textContent: null
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "loadTextContent",
    /*#__PURE__*/
    (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var page, cancellable, textContent;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              page = _this.props.page;
              _context.prev = 1;
              cancellable = (0, _utils.makeCancellable)(page.getTextContent());
              _this.runningTask = cancellable;
              _context.next = 6;
              return cancellable.promise;

            case 6:
              textContent = _context.sent;

              _this.setState({
                textContent: textContent
              }, _this.onLoadSuccess);

              _context.next = 13;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](1);

              _this.onLoadError(_context.t0);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 10]]);
    })));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onLoadSuccess", function () {
      var onGetTextSuccess = _this.props.onGetTextSuccess;
      var textContent = _this.state.textContent;
      (0, _utils.callIfDefined)(onGetTextSuccess, textContent);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onLoadError", function (error) {
      if ((0, _utils.isCancelException)(error)) {
        return;
      }

      _this.setState({
        textContent: undefined
      });

      (0, _utils.errorOnDev)(error);
      var onGetTextError = _this.props.onGetTextError;
      (0, _utils.callIfDefined)(onGetTextError, error);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onRenderSuccess", function () {
      var onRenderTextLayerSuccess = _this.props.onRenderTextLayerSuccess;
      (0, _utils.callIfDefined)(onRenderTextLayerSuccess);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onRenderError", function (error) {
      if ((0, _utils.isCancelException)(error)) {
        return;
      }

      (0, _utils.errorOnDev)(error);
      var onRenderTextLayerError = _this.props.onRenderTextLayerError;
      (0, _utils.callIfDefined)(onRenderTextLayerError, error);
    });
    return _this;
  }

  (0, _createClass2.default)(TextLayerInternal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var page = this.props.page;

      if (!page) {
        throw new Error('Attempted to load page textContent, but no page was specified.');
      }

      this.loadTextContent();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var page = this.props.page;

      if (prevProps.page && page !== prevProps.page) {
        this.loadTextContent();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      (0, _utils.cancelRunningTask)(this.runningTask);
    }
  }, {
    key: "renderTextLayer",
    value: function renderTextLayer() {
      var textContent = this.state.textContent;

      if (!textContent) {
        return;
      }

      var page = this.props.page;
      var viewport = this.viewport;
      var parameters = {
        textContent: textContent,
        container: this.textLayer,
        viewport: viewport,
        enhanceTextSelection: false
      };
      this.textLayer.innerHTML = '';

      try {
        _pdfjsDist.default.renderTextLayer(parameters);

        this.onRenderSuccess();
      } catch (error) {
        this.onRenderError(error);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement("div", {
        className: "react-pdf__Page__textContent textLayer",
        ref: function ref(_ref2) {
          _this2.textLayer = _ref2;
        }
      }, this.renderTextLayer());
    }
  }, {
    key: "viewport",
    get: function get() {
      var _this$props = this.props,
          page = _this$props.page,
          rotate = _this$props.rotate,
          scale = _this$props.scale;
      return page.getViewport({
        scale: scale,
        rotation: rotate
      });
    }
  }]);
  return TextLayerInternal;
}(_react.PureComponent);

exports.TextLayerInternal = TextLayerInternal;
TextLayerInternal.propTypes = {
  onGetTextError: _propTypes.default.func,
  onGetTextSuccess: _propTypes.default.func,
  onRenderTextLayerError: _propTypes.default.func,
  onRenderTextLayerSuccess: _propTypes.default.func,
  page: _propTypes2.isPage,
  rotate: _propTypes2.isRotate,
  scale: _propTypes.default.number
};

var TextLayer = function TextLayer(props) {
  return _react.default.createElement(_DocumentContext.default.Consumer, null, function (documentContext) {
    return _react.default.createElement(_PageContext.default.Consumer, null, function (pageContext) {
      return _react.default.createElement(TextLayerInternal, (0, _extends2.default)({}, documentContext, pageContext, props));
    });
  });
};

var _default = TextLayer;
exports.default = _default;