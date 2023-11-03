<template>
    <div>
        <div class="row">
            <div class="trait-score column">
                <img v-if="die" class="trait-die" :id="`${trait}-die`" :src="`/d${die}.png`"/>
                <h3 class="trait" :id="trait">{{ die ? `d${die}` : "?" }}</h3>
            </div>
            <h3 class="trait-label">{{ trait }}!</h3>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        die: {
            type: Number,
            required: false,
            default: 0,
        },
        trait: {
            type: String,
            required: true,
        },
    }
}
</script>

<style scoped>
.die, .trait {
    color: #8d2;
}

.trait-die {
    max-height: 2.5rem;
    max-width: 2.5rem;
}

.trait-label {
    font-size: 1.4rem;
    font-style: italic;
    font-weight: 800;
    text-shadow: 0px 0px 3px #808;
}

.trait-score {
    margin-right: 1rem;
}
</style>