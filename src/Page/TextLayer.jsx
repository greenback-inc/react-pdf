import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import pdfjs from 'pdfjs-dist';

import DocumentContext from '../DocumentContext';
import PageContext from '../PageContext';

import {
  callIfDefined,
  cancelRunningTask,
  errorOnDev,
  isCancelException,
  makeCancellable,
} from '../shared/utils';

import { isPage, isRotate } from '../shared/propTypes';

export class TextLayerInternal extends PureComponent {

  state = {
    textContent: null,
  }

  componentDidMount() {
    const { page } = this.props;

    if (!page) {
      throw new Error('Attempted to load page textContent, but no page was specified.');
    }

    this.loadTextContent();
  }

  componentDidUpdate(prevProps) {
    const { page } = this.props;

    if (
      (prevProps.page && (page !== prevProps.page))
    ) {
      this.loadTextContent();
    }
  }

  componentWillUnmount() {
    cancelRunningTask(this.runningTask);
  }

  loadTextContent = async () => {
    const { page } = this.props;

    try {
      const cancellable = makeCancellable(page.getTextContent());
      this.runningTask = cancellable;
      const textContent = await cancellable.promise;
      this.setState({ textContent }, this.onLoadSuccess);
    } catch (error) {
      this.onLoadError(error);
    }
  }

  onLoadSuccess = () => {
    const { onGetTextSuccess } = this.props;
    const { textContent } = this.state;

    callIfDefined(
      onGetTextSuccess,
      textContent,
    );
  }

  onLoadError = (error) => {
    if (isCancelException(error)) {
      return;
    }

    this.setState({ textContent: undefined });

    errorOnDev(error);

    const { onGetTextError } = this.props;

    callIfDefined(
      onGetTextError,
      error,
    );
  }

  onRenderSuccess = () => {
    const { onRenderTextLayerSuccess } = this.props;

    callIfDefined(onRenderTextLayerSuccess);
  }

  /**
   * Called when a text layer fails to render.
   */
  onRenderError = (error) => {
    if (isCancelException(error)) {
      return;
    }

    errorOnDev(error);

    const { onRenderTextLayerError } = this.props;

    callIfDefined(
      onRenderTextLayerError,
      error,
    );
  }

  get viewport() {
    const { page, rotate, scale } = this.props;

    return page.getViewport({ scale, rotation: rotate });
  }

  renderTextLayer() {
    const { textContent } = this.state;

    if (!textContent) {
      return;
    }

    const { page } = this.props;
    const viewport = this.viewport;

    const parameters = {
      textContent: textContent,
      container: this.textLayer,
      viewport: viewport,
      enhanceTextSelection: false
    };

    this.textLayer.innerHTML = '';

    try {
      pdfjs.renderTextLayer(parameters);
      this.onRenderSuccess();
    } catch (error) {
      this.onRenderError(error);
    }
  }

  render() {
    return (
      <div
        className="react-pdf__Page__textContent textLayer"
        ref={(ref) => { this.textLayer = ref; }}
      >
        {this.renderTextLayer()}
      </div>
    );
  }
}

TextLayerInternal.propTypes = {
  onGetTextError: PropTypes.func,
  onGetTextSuccess: PropTypes.func,
  onRenderTextLayerError: PropTypes.func,
  onRenderTextLayerSuccess: PropTypes.func,
  page: isPage,
  rotate: isRotate,
  scale: PropTypes.number,
};

const TextLayer = props => (
  <DocumentContext.Consumer>
    {documentContext => (
      <PageContext.Consumer>
        {pageContext => (
          <TextLayerInternal {...documentContext} {...pageContext} {...props} />
        )}
      </PageContext.Consumer>
    )}
  </DocumentContext.Consumer>
);

export default TextLayer;
