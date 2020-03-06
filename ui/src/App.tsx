import React, { useState, useEffect } from "react"
import "./App.css"
import { animated, useTransition } from "react-spring"

const pages = [
  ({ style }: any) => (
    <animated.div style={{ ...style, background: "lightblue" }}>
      Hold on...
    </animated.div>
  ),
  ({ style, score }: any) => (
    <animated.div style={{ ...style, background: "lightgreen" }}>
      The corona score is {score}
    </animated.div>
  ),
  ({ style, score }: any) => (
    <animated.div style={{ ...style, background: "lightpink" }}>
      The corona score is {score}
    </animated.div>
  )
]

export const App = () => {
  const [score, setScore] = useState(0)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(location => {
      const { coords } = location

      fetch(
        `http://localhost:8800/?lat=${coords.latitude}&long=${coords.longitude}`
      ).then(res => {
        res.json().then(json => setScore(json.score))
      })
    })
  }, [])

  const transitions = useTransition(score, p => p, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })
  return (
    <div className="app">
      {transitions.map(({ item, props, key }) => {
        let Page = pages[0]

        if (item < 0) {
          Page = pages[1]
        } else if (item > 0) {
          Page = pages[2]
        }

        return <Page key={key} style={props} score={item} />
      })}
    </div>
  )
}
