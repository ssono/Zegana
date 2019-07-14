import React from 'react';
import {Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw} from 'draft-js';
import '../css/editor.css';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      focused: false
    };

    this.onChange = (editorState) => {
      this.setState({editorState});
      this.props.update(JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())));
    }

    this.setEditor = (editor) => {
      this.editor = editor;
    };
    
    this.focusEditor = () => {
      if (this.editor) {
        this.editor.focus();
      }
    };

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }

   _handleKeyCommand(command, editorState) {
          const newState = RichUtils.handleKeyCommand(editorState, command);
          if (newState) {
            this.onChange(newState);
            return true;
          }
          return false;
        }
        _mapKeyToEditorCommand(e) {
          if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
              e,
              this.state.editorState,
              4, /* maxDepth */
            );
            if (newEditorState !== this.state.editorState) {
              this.onChange(newEditorState);
            }
            return;
          }
          return getDefaultKeyBinding(e);
        }
        _toggleBlockType(blockType) {
          this.onChange(
            RichUtils.toggleBlockType(
              this.state.editorState,
              blockType
            )
          );
        }
        _toggleInlineStyle(inlineStyle) {
          this.onChange(
            RichUtils.toggleInlineStyle(
              this.state.editorState,
              inlineStyle
            )
          );
        }

  componentDidMount() {
    this.focusEditor();
  }

  render() {
    const editorState = this.state.editorState;
    return (
      <div className={`editorWrap ${this.state.focused ? 'editorWrapfocused': ''}`} onClick={this.focusEditor}>
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />

        <hr/>

        <Editor
          ref={this.setEditor}
          handleKeyCommand={this.handleKeyCommand}
          editorState={this.state.editorState}
          onChange={this.onChange}
          placeholder={this.props.placeholder}
          onFocus={() => this.setState({focused:true})}
          onBlur={() => this.setState({focused: false})}
        />
      </div>
    );
  }

}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let className = 'editorWrap-styleButton';
    if (this.props.active) {
      className += ' editorWrap-activeButton';
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-four'},
  {label: 'H2', style: 'header-five'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="editorWrap-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'}
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  
  return (
    <div className="editorWrap-controls">
      {INLINE_STYLES.map((type) =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

export default MyEditor;