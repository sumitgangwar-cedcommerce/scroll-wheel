import React, { TouchEventHandler, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function roundToNearest(num: number): number {
  const decimalPart = Math.abs(num) - Math.floor(Math.abs(num)); // Get the decimal part of the absolute value of the number
  
  if (decimalPart <= 0.5) {
    return Math.sign(num) * Math.floor(Math.abs(num));
  } else {
    return Math.sign(num) * Math.ceil(Math.abs(num));
  }
}

function App() {

  const [scrollPos, setScrollPos] = useState(0)
  const [selectedNum, setSelectedNum] = useState(0)

  const [marginTop , setMarginTop] = useState(-1600)

  const [initialPos , setInitialPos] = useState([0 , 0 , 0])

  const [isMouseMoving , setisMouseMoving] = useState(false)

  const [mouseMoveDist , setMouseMoveDist] = useState(0)

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const scrollPosition = e.currentTarget.scrollTop;
    setScrollPos(scrollPosition)
  };

  const handelClick = (num: number) => {
    setSelectedNum(num)
  }

  const getElementLi = () => {
    let ele: any[] = []
    for (let i = 1; i < 41; i++) {
      const currNum = (((selectedNum - i) % 10) + 10) % 10
      const currEle = (
        <li
          key={i + 'top'}
          onClick={() => handelClick(currNum)}
        >
          {currNum}
        </li>
      )
      ele = [currEle, ...ele]
    }
    ele.push(<li onClick={() => handelClick(selectedNum)} id='selected' className='selected'>{selectedNum}</li>)
    for (let i = 1; i < 41; i++) {
      const currNum = (((selectedNum + i) % 10) + 10) % 10
      const currEle = (
        <li
          key={i + 'bottom'}
          onClick={() => handelClick(currNum)}
        >
          {currNum}
        </li>
      )
      ele.push(currEle)
    }
    return ele
  }

  const handelTouchStart: TouchEventHandler<HTMLUListElement> = (event) => {
    // console.log(event);
  };

  const handelMouseDown:React.MouseEventHandler<HTMLUListElement> = (event) => {
    setInitialPos(prev => [event.pageY , prev[1] , prev[2]])
    setisMouseMoving(true)
  }

  const handelMouseMove:React.MouseEventHandler<HTMLUListElement> = (event) => {
    let dist = initialPos[0] - event.pageY
    if(!isMouseMoving) return
    // console.log(dist)
    setMouseMoveDist(initialPos[1] + dist)

    const curr = roundToNearest(Math.abs(initialPos[1] + dist) / 40)
    if(curr > initialPos[2]){
      let diff = curr - initialPos[2]
      setMarginTop(prev => {
        let newDist = diff * 40
        if(dist < 0) newDist = -1 * newDist
        return prev + newDist
      })
      setInitialPos(prev => [prev[0] , prev[1] , curr])
      setSelectedNum(prev => {
        if(dist<0){
          return (((prev - diff)%10)+10)%10
        }
        return (((prev + diff)%10)+10)%10
      })
    }
  }

  const handelMouseUp:React.MouseEventHandler<HTMLUListElement> = (event) => {
    setInitialPos([0 , mouseMoveDist , 0])
    // setMouseMoveDist()
    setisMouseMoving(false)
  }

  const handelMouseLeave:React.MouseEventHandler<HTMLUListElement> = (event) => {
    setisMouseMoving(false)
    setInitialPos([0 , mouseMoveDist , 0])
  }

  // useEffect(()=>{
  //   const selectedElement = document.getElementById("myUl")
  //   const tt = selectedElement?.getElementsByClassName('selected')[0]  as HTMLElement
  //   if(tt && selectedElement){
  //     const pt = selectedElement.offsetTop
  //     const ct = tt.offsetTop
  //     selectedElement.scrollTo({
  //       top:ct - pt - 160,
  //       // behavior:'smooth'
  //     })
  //   }
  //   console.log(tt);
  // },[selectedNum])

  // console.log(initialPos);

  const handelDrag = (e: any) => {
    console.log(e)
  }

  console.log(mouseMoveDist)

  return (
    <div className="App">
      <div className='wheel'>
        <div className='wheel-count'>
          <ul
            id='myUl'
            onScroll={handleScroll}
            style={{
              marginTop:`${marginTop}px`,
              transform:`translate3D(0 , ${-mouseMoveDist}px , 0)`,
              transition:!isMouseMoving ? "transform 1000ms cubic-bezier(0.19, 1, 0.22, 1) 0s" : ''

            }}
            onTouchStart={handelTouchStart}
            onMouseDown={handelMouseDown}
            onMouseMove={handelMouseMove}
            onMouseLeave={handelMouseLeave}
            onMouseUp={handelMouseUp}
          >
            {
              getElementLi()
            }
          </ul>
        </div>
      </div>
      {
        scrollPos
      }
    </div>
  );
}

export default App;
