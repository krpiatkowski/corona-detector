import React, { useState, useEffect } from "react"
import "./App.css"
import { animated, useTransition } from "react-spring"

type Result = {
  score: number | undefined
  region: string | undefined
}

const pages = [
  ({ style }: any) => (
    <animated.div style={{ ...style, background: "lightblue" }}>
      Hold on...
    </animated.div>
  ),
  ({ style, score, region }: any) => (
    <animated.div style={{ ...style, background: "lightgreen" }}>
      <small>The corona trend score in {region} is</small>
      <h1>{score.toFixed(2)}</h1>
    </animated.div>
  ),
  ({ style, score, region }: any) => (
    <animated.div style={{ ...style, background: "lightpink" }}>
      <small>The corona trend score in {region} is</small>
      <h1>{score.toFixed(2)}</h1>
    </animated.div>
  )
]

export const App = () => {
  const [score, setScore] = useState(0)
  const [region, setRegion] = useState("")

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(location => {
      const { coords } = location
      startScoreFetcher(coords)
    })
  }, [])

  const startScoreFetcher = (coords: {
    latitude: number
    longitude: number
  }) => {
    setTimeout(() => {
      fetch(
        `http://localhost:8800/?lat=${coords.latitude}&long=${coords.longitude}`
      ).then(res => {
        res.json().then(json => {
          const result = json as Result
          setRegion(result.region || "")
          setScore(result.score || 0)
          startScoreFetcher(coords)
        })
      })
    }, 5000)
  }

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

        return <Page key={key} style={props} score={item} region={region} />
      })}
    </div>
  )
}
