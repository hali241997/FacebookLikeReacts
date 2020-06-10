import React, { Component } from 'react';
import { TouchableOpacity, View, FlatList, TouchableHighlight, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Sound from 'react-native-sound';

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: false,
            imgSource: require('./images/ic_like.png'),
            reactionSources: [
                { selected: false, imageSource: require('./images/ic_like_fill.png'), gifSource: require('./images/like.gif') },
                { selected: false, imageSource: require('./images/love2.png'), gifSource: require('./images/love.gif') },
                { selected: false, imageSource: require('./images/haha2.png'), gifSource: require('./images/haha.gif') },
                { selected: false, imageSource: require('./images/wow2.png'), gifSource: require('./images/wow.gif') },
                { selected: false, imageSource: require('./images/sad2.png'), gifSource: require('./images/sad.gif') },
                { selected: false, imageSource: require('./images/angry2.png'), gifSource: require('./images/angry.gif') }
            ],
        };
        this.boxOpenSound = null;
        this.iconChooseSound = null;
        this.boxCloseSound = null;
    }

    componentDidMount() {
        this.boxOpenSound = new Sound(require('./sounds/box_up.mp3'), '', error => {
            if(error) {
                console.log('Failed to load boxOpenSound', error);
            }
        });

        this.iconChooseSound = new Sound(require('./sounds/icon_choose.mp3'), '', error => {
            if(error) {
                console.log('Failed to load iconChooseSound', error);
            }
        });

        this.boxCloseSound = new Sound(require('./sounds/box_down.mp3'), '', error => {
            if(error) {
                console.log('Failed to load boxCloseSound', error);
            }
        });
    }

    componentWillUnmount() {
        if(this.boxOpenSound) {
            this.boxOpenSound.release();
            this.boxOpenSound = null;
        }
        if(this.iconChooseSound) {
            this.iconChooseSound.release();
            this.iconChooseSound = null;
        }
        if(this.boxCloseSound) {
            this.boxCloseSound.release();
            this.boxCloseSound =  null;
        }
    }

    onReactionPress = (item, index) => {
        let sources = this.state.reactionSources;

        if(item.selected) {
            sources[index].selected = false;
            this.setState({ imgSource: require('./images/ic_like.png'), display: false, reactionSources: sources });
        }
        else {
            sources.map((v) => {
                if(v === item) v.selected = true;
                else v.selected = false
            });

            this.setState({ imgSource: item.imageSource, display: false, reactionSources: sources });
        }

        if(this.iconChooseSound) {
            if(!this.iconChooseSound.isPlaying()) {
                this.iconChooseSound.play((success) => {
                    if(success) {
                        this.iconChooseSound.stop();
                    }
                })
            }
            else if(this.iconChooseSound.isPlaying) {
                this.iconChooseSound.stop();
            }
        }
    };

    openReactionBox = () => {
        if(this.props.lastOpen === -1) {
            this.props.setLastOpen(this.props.index);
        }
        else {
            this.props.closeRest(this.props.lastOpen);
            this.props.setLastOpen(this.props.index);
        }

        if(!this.state.display) {
            this.setState({ display: true });

            if(this.boxOpenSound) {
                if(!this.boxOpenSound.isPlaying()) {
                    this.boxOpenSound.play((success) => {
                        if(success) {
                            this.boxOpenSound.stop();
                        }
                    })
                }
                else if(this.boxOpenSound.isPlaying) {
                    this.boxOpenSound.stop();
                }
            }
        }
    };

    onBackgroundPressed = () => {
        if(this.state.display) {
            this.setState({ display: false });

            if(this.boxCloseSound) {
                if(!this.boxCloseSound.isPlaying()) {
                    this.boxCloseSound.play((success) => {
                        if(success) {
                            this.boxCloseSound.stop();
                        }
                    })
                }
                else if(this.boxCloseSound.isPlaying) {
                    this.boxCloseSound.stop();
                }
            }
        }
    };

    closeWithoutSound = () => {
        if(this.state.display) this.setState({ display: false })
    }

    render() {
        return (
            <>
                <View style={{ display: this.state.display ? 'flex' : 'none'}}>
                    <FlatList
                        style={{ backgroundColor: 'white', width: 250, height: 50, paddingHorizontal: 10, borderRadius: 25, position: 'absolute', top: -50, right: 50 }}
                        contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}
                        data={this.state.reactionSources}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableHighlight
                                    underlayColor=''
                                    style={{ alignItems: 'center' }}
                                    onPress={() => this.onReactionPress(item, index)}
                                >
                                    <>
                                        <FastImage
                                            source={item.gifSource}
                                            style={styles.gifStyle}
                                        />
                                        {
                                            item.selected && (
                                                <View style={{ width: 5, height: 5, borderRadius: 2.5, borderColor: 'red', borderWidth: 1, backgroundColor: 'red', marginTop: 2 }} />
                                            )
                                        }
                                    </>
                                </TouchableHighlight>
                            );
                        }}
                    />
                </View>

                <TouchableOpacity
                    style={{ borderColor: 'black', borderWidth: 1, padding: 10, width: 100 }}
                    onLongPress={this.openReactionBox}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <FastImage
                            source={this.state.imgSource}
                            style={{ width: 20, height: 20, marginRight: 10 }}
                        />
                        <Text>{this.props.comment}</Text>
                    </View>
                </TouchableOpacity>
            </>
        );
    }
}

const styles = StyleSheet.create({
    gifStyle: {
        width: 30,
        height: 30
    }
});

export default Comment;