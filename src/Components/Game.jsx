import React from 'react'

const Game = (props) => {

    return (
    <>
        <iframe src={props.link} width={props.width} height={props.height} allowFullScreen style={{justifySelf:"center"}}/>
    </>
  )
}

export default Game