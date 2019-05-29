/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
//Hier werden die benötigten Libraries und Komponente von React Natvie importiert
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity,Image, Dimensions} from 'react-native';
import { RNCamera } from 'react-native-camera'; // CAMERA LIBRARY (SEHR WICHTIG)
//Größe der Gesichtspunkte
const landmarkSize = 2;



type Props = {};
export default class App extends Component<Props> {
    //Einstellungen für die Kamera wie zoom, flash und Größe
    state = {
        flash: 'off',
        zoom: 0,
        autoFocus: 'on',
        depth: 0,
        type: 'back',
        whiteBalance: 'auto',
        ratio: '16:9',
        recordOptions: {
            mute: false,
            maxDuration: 5,
            quality: RNCamera.Constants.VideoQuality['288p'],
        },
        //Diese States müssen von anfanf an auf false gestellt werden, weil man ja nicht von
        // Anfang an Gesichter erkennen will
        canDetectFaces: false,
        canDetectText: false,
        canDetectBarcode: false,
        faceDetected:false,
        faces: [],
        source:require('/Projekte/informatik/img/maxresdefault.jpg')

    };
    //Frontkamera und Rückkamera wechseln
    toggleFacing() {
        this.setState({
            type: this.state.type === 'back' ? 'front' : 'back',
        });
    }







    toggle = value => () => this.setState(prevState => ({ [value]: !prevState[value] }));
    //Funktion die gerufen wird, wenn Gesichter erkannt werden
    facesDetected = ({ faces }) => this.setState({ faces,
        //Gezeigtes Bild ändern
source: require('/Projekte/informatik/img/circle.png')});
    //Hier wird ein Viereck um das Gesicht der Person gezeichnet
    renderFace = ({ bounds, faceID, rollAngle, yawAngle }) => (
        <View
            key={faceID}
            transform={[
                { perspective: 600 },
                { rotateZ: `${rollAngle.toFixed(0)}deg` },
                { rotateY: `${yawAngle.toFixed(0)}deg` },
            ]}
            //Wie das Viereck aussehen soll
            style={[
                styles.face, //weiter unten definiert
                {
                    ...bounds.size,
                    left: bounds.origin.x,
                    top: bounds.origin.y,
                },
            ]}
        >

            <Text style={styles.faceText}>ID: {faceID}</Text>
            <Text style={styles.faceText}>Face detected! </Text>
            <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
            <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
        </View>
    );
    //Zeichnet die Gesichtspunkte funktioniert aber nicht richtig
    renderLandmarksOfFace(face) {
        const renderLandmark = position =>
            position && (
                <View
                    style={[
                        styles.landmark,
                        {
                            left: position.x - landmarkSize ,
                            top: position.y - landmarkSize,
                        },
                    ]}
                />
            );
        return (
            <View key={`landmarks-${face.faceID}`}>

                {renderLandmark(face.leftEyePosition)}
                {renderLandmark(face.rightEyePosition)}
                {renderLandmark(face.leftEarPosition)}
                {renderLandmark(face.rightEarPosition)}
                {renderLandmark(face.leftCheekPosition)}
                {renderLandmark(face.rightCheekPosition)}
                {renderLandmark(face.leftMouthPosition)}
                {renderLandmark(face.mouthPosition)}
                {renderLandmark(face.rightMouthPosition)}
                {renderLandmark(face.noseBasePosition)}
                {renderLandmark(face.bottomMouthPosition)}
            </View>
        );
    }

    renderFaces = () => (
        <View style={styles.facesContainer} pointerEvents="none">
            {this.state.faces.map(this.renderFace)}


        </View>
      //this.setState({source: require('/Projekte/informatik/img/circle.png')})

    );


    renderLandmarks = () => (
        <View style={styles.facesContainer} pointerEvents="none">
            {this.state.faces.map(this.renderLandmarksOfFace)}
        </View>
    );





    renderCamera() {
        const { canDetectFaces } = this.state;
        return (

            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                //flex 2 damit der Bildschirm in 2 geteilt wird
                style={{
                    flex: 2,
                }}
                //Definitionen der Kameraeigenschaften
                type={this.state.type}
                flashMode={this.state.flash}
                autoFocus={this.state.autoFocus}
                zoom={this.state.zoom}
                whiteBalance={this.state.whiteBalance}
                ratio={this.state.ratio}
                focusDepth={this.state.depth}
                trackingEnabled

                faceDetectionLandmarks={
                    RNCamera.Constants.FaceDetection.Landmarks
                        ? RNCamera.Constants.FaceDetection.Landmarks.all
                        : undefined
                }
                faceDetectionClassifications={
                    RNCamera.Constants.FaceDetection.Classifications
                        ? RNCamera.Constants.FaceDetection.Classifications.all
                        : undefined
                }
                onFacesDetected={canDetectFaces ? this.facesDetected : null}

            >
                <View
                    style={{
                        flex: 0.5,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                        }}
                    >
                        <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing.bind(this)}>
                            <Text style={styles.flipText}> FLIP </Text>
                        </TouchableOpacity>


                    </View>
                    <!--  Definition vom Gesichtserkennungsknopf-->
                    <View
                        style={{
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                        }}
                    >
                        <TouchableOpacity onPress={this.toggle('canDetectFaces')} style={styles.flipButton}>
                            <Text style={styles.flipText}>
                                {!canDetectFaces ? 'Detect Faces' : 'Detecting Faces'}
                            </Text>
                        </TouchableOpacity>


                    </View>
                </View>
                <View
                    style={{
                        flex: 0.4,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                    }}
                >

                </View>
                <View
                    style={{
                        flex: 0.1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                    }}
                >

                </View>

                {!!canDetectFaces && this.renderFaces()}
                {/*!!canDetectFaces && this.renderLandmarks()*/}

            </RNCamera>




        );
    }
        //Das ist nötig gewesen um den Bildschirm in 2 zu teilen
    render() {
        return (<View
        style={{flex:1

        }}>

            {this.renderCamera()}

            <Image
                style={{
                    flex:2,
                    width: Dimensions.get("window").width




                }}
                resizeMode={'stretch'}
                source={this.state.source}
               // {this.state.faceDetected!==0 && this.setState({source:
                // require('/Projekte/informatik/img/circle.png')})}

            />


        </View>);
    }
}
/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});*/
//Styledefinitionen um zu entscheiden wie die Buttons aussehen sollen und das Viereck der
// Gesichtserkennung und viele anderen Sachen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#000',
    },
    flipButton: {
        flex: 0.3,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipText: {
        color: 'white',
        fontSize: 15,
    },
    zoomText: {
        position: 'absolute',
        bottom: 70,
        zIndex: 2,
        left: 2,
    },
    picButton: {
        backgroundColor: 'darkseagreen',
    },
    facesContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    face: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#0b00ff',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    landmark: {
        width: landmarkSize,
        height: landmarkSize,
        position: 'absolute',
        backgroundColor: 'red',
    },
    faceText: {
        color: '#FFD700',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'transparent',
    },
    text: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#F00',
        justifyContent: 'center',
    },
    textBlock: {
        color: '#F00',
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
});
