import React, { useEffect, useRef, useState } from 'react';

export default function Timer(props) {
    const [time, setTime] = useState(props.time);

    useEffect(() => {
        const interval = setInterval(() => setTime(time - 1), 1000);
        if (time === 0) {
            clearInterval(interval);
            props.handleTime(time);
        }
        return () =>  {
            //setChatList([]);
            clearInterval(interval);
        }

    });
    return (
        <span>
            {time}
        </span>
    );
}