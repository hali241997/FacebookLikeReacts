import React, { Component } from 'react';
import { TouchableHighlight, FlatList } from 'react-native';
import Comment from './Comment';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [
                { comment: 'I am Hasnain' },
                { comment: 'I am Ali' },
            ],
            lastOpen: -1
        }
        this.commentRef = {};
    }

    closeAll = () => {
        if(this.state.lastOpen !== -1) {
            this.commentRef[this.state.lastOpen].onBackgroundPressed();
        }
    };

    render() {
        return (
            <TouchableHighlight
                underlayColor=''
                style={{ flex: 1, backgroundColor: 'green' }}
                onPress={this.closeAll}
            >
                <FlatList
                    contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
                    data={this.state.comments}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <Comment
                                ref={(Comment) => this.commentRef[index] = Comment}
                                lastOpen={this.state.lastOpen}
                                setLastOpen={(lastOpen) => this.setState({ lastOpen })}
                                index={index}
                                comment={item.comment}
                                closeRest={(index) => this.commentRef[index].closeWithoutSound()}
                            />
                        );
                    }}
                />
            </TouchableHighlight>
        );
    }
}

export default App;