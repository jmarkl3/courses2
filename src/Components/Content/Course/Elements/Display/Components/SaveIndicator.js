import React from 'react'

function SaveIndicator({saveIndicatorMessage, saveIndicatorMessageCount}) {
    /*
    when saveIndicatorMessageCount changes refresh
    display the style based on the message content
    show it initially, reset fade timer and hide timer
    after a timer start fade
    after a timer hide it (and its hiddedn initially)
    */
  return (
    <div className='saveIndicator'>
        {saveIndicatorMessage}
    </div>
  )
}

export default SaveIndicator