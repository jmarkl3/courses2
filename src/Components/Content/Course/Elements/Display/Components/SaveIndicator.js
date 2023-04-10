import React, { useEffect, useRef, useState } from 'react'

function SaveIndicator({saveIndicatorMessage, saveIndicatorMessageCount}) {
    const [fading, setFading] = useState()
    const [hidden, setHidden] = useState(true)
    const fadeTimer = useRef()
    const hideTimer = useRef()

    useEffect(() => {
        // Before a message is set the indicator should be hidden
        if(!saveIndicatorMessage) return

        // Show the elements
        setFading(false)

        // This is to reset the css so it doesnt fade in
        setHidden(true)
        setTimeout(() => {
            setHidden(false)
        }, 50);

        // Clear the timeouts
        clearTimeout(fadeTimer.current)
        clearTimeout(hideTimer.current)

        // Set timeouts to fade then hide the component
        fadeTimer.current = setTimeout(() => {
            setFading(true)
        }, 1000);

        hideTimer.current = setTimeout(() => {
            setHidden(true)
        }, 4000);
    },[saveIndicatorMessageCount, saveIndicatorMessage])

  return (
    <>
        {!hidden &&
            <div className={`saveIndicator ${fading ? "saveIndicatorFade":""} ${(saveIndicatorMessage === "Saved") ? "":"saveIndicatorError"}`}>
                {saveIndicatorMessage}
            </div>
        }
    </>
  )
}

export default SaveIndicator