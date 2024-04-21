<template>
  <div
    id="block"
    class="h-full box-border max-w-full border-2 border-primary rounded-lg"
    :style="{gridColumnStart: blockStartX, gridColumnEnd: `span ${blockWidth}`, gridRowStart: blockStartY, gridRowEnd: `span ${blockHeight}`}"
    draggable="true"
    @dragstart="(e) => handleDragStart(e)"
    @drag="(e) => handleDrag(e)"
    @dragend="handleDragEnd"
  >
    <div class="w-full h-full p-6">
      <slot name="block-content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defaultBlockSizes } from '~/utils/defaults';
defineOptions({
    name: 'PageBlock'
});

const props = defineProps({
    width: {
        type: Number,
        default: 3
    },
    height: {
        type: Number,
        default: 3
    }
});

const blockHeight = ref(props.height);
const blockWidth = ref(props.width);
const blockStartX = ref(1);
const blockStartY = ref(1);
const changeRight = ref(false);
const changeLeft = ref(false);
const changeTop = ref(false);
const changeBottom = ref(false);
const changePosition = ref(false);
const dragSensitivity = 100;

function isInBorderArea (element: HTMLElement | null, padding: number, clientX: number, clientY: number) {
    const areas = {
        top: false,
        bottom: false,
        left: false,
        right: false,
        middle: false
    };

    if (!element) {
        return areas;
    }
    const rect = element.getBoundingClientRect();
    const isInRect = clientY > rect.y && clientY < rect.y + rect.height && clientX > rect.x && clientX < rect.x + rect.width;
    const isInLeftBorder = clientX > rect.x && clientX < rect.x + padding && isInRect;
    const isInRightBorder = clientX > rect.x + rect.width - padding && clientX < rect.x + rect.width && isInRect;
    const isInTopBorder = clientY > rect.y && clientY < rect.y + padding && isInRect;
    const isInBottomBorder = clientY > rect.y + rect.height - padding && clientY < rect.y + rect.height && isInRect;
    const isInMiddle = isInRect && clientY > (rect.y + padding) && clientY < (rect.y + rect.height - padding) && clientX > (rect.x + padding) && clientX < (rect.x + rect.width - padding);

    if (isInBottomBorder) {
        areas.bottom = true;
    }

    if (isInTopBorder) {
        areas.top = true;
    }

    if (isInLeftBorder) {
        areas.left = true;
    }

    if (isInRightBorder) {
        areas.right = true;
    }

    if (isInMiddle) {
        areas.middle = true;
    }

    return areas;
}

function handleDragStart (e: DragEvent) {
    // @ts-ignore
    const areas = isInBorderArea(e.target, 48, e.clientX, e.clientY);
    if (areas.bottom) {
        changeBottom.value = true;
    }
    if (areas.top) {
        changeTop.value = true;
    }
    if (areas.right) {
        changeRight.value = true;
    }
    if (areas.left) {
        changeLeft.value = true;
    }
    if (areas.middle) {
        changePosition.value = true;
    }
}

function handleDragEnd () {
    changeBottom.value = false;
    changeTop.value = false;
    changeRight.value = false;
    changeLeft.value = false;
    changePosition.value = false;
}

function changeBlock (change: number, changeFactor: number) {
    if (change < -changeFactor) {
        return -1;
    } else if (change > changeFactor) {
        return 1;
    } else {
        return 0;
    }
}

function handleDrag (e: DragEvent) {
    // @ts-ignore
    const rect = e.target?.getBoundingClientRect();
    if (!rect) {
        return;
    }
    // @ts-ignore
    if (changeRight.value) {
        const change = e.clientX - (rect.x + rect.width);
        // console.log('----');
        // console.log(e.clientX);
        // console.log(rect.x);
        // console.log(rect.width);
        // console.log('----');

        if (e.clientX !== 0) {
            blockWidth.value += changeBlock(change, dragSensitivity);
        }
    }
    if (changeLeft.value) {
        const change = e.clientX - (rect.x + rect.width);

        if (e.clientX !== 0) {
            if (blockStartX.value !== 1 && (blockWidth.value - blockStartX.value > defaultBlockSizes.width)) {
                blockWidth.value -= changeBlock(change, dragSensitivity);
            }
            blockStartX.value += changeBlock(change, dragSensitivity);
        }
    }
    if (changeBottom.value) {
        const change = e.clientY - (rect.y + rect.height);
        if (e.clientY !== 0) {
            blockHeight.value += changeBlock(change, dragSensitivity);
        }
    }

    if (changePosition.value) {
        const changeY = e.clientY - (rect.y + rect.height);
        const changeX = e.clientX - (rect.x + rect.width);

        if (e.clientY !== 0 && e.clientX !== 0) {
            if (13 - blockWidth.value - blockStartX.value >= 0) {
                blockStartX.value += changeBlock(changeX, dragSensitivity);
            }
            if (7 - blockHeight.value - blockStartY.value >= 0) {
                blockStartY.value += changeBlock(changeY, dragSensitivity);
            }
        }
    }
    //   if (changeTop) {
    //     blockHeight.value = e.clientY;
    //     if (blockHeight.value < defaultBlockSizes.height) {
    //       blockHeight.value = defaultBlockSizes.height;
    //     }
    //   }

    if (blockHeight.value < defaultBlockSizes.height) {
        blockHeight.value = defaultBlockSizes.height;
    }

    if (blockHeight.value > 7 - blockStartY.value) {
        blockHeight.value = 7 - blockStartY.value;
    }

    if (blockWidth.value < defaultBlockSizes.width) {
        blockWidth.value = defaultBlockSizes.width;
    }

    if (blockWidth.value > 13 - blockStartX.value) {
        blockWidth.value = 13 - blockStartX.value;
    }

    if (blockStartX.value < 1) {
        blockStartX.value = 1;
    }

    if (blockStartY.value < 1) {
        blockStartY.value = 1;
    }
}

</script>
