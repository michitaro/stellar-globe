import { PointerSensor as LibPointerSensor } from '@dnd-kit/core';
import { PointerEvent } from 'react';
export declare class PointerSensor extends LibPointerSensor {
    static activators: {
        eventName: "onPointerDown";
        handler: ({ nativeEvent: event }: PointerEvent<Element>, { onActivation }: import("@dnd-kit/core").PointerSensorOptions) => boolean;
    }[];
}
