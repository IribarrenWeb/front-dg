<template>
    <div class="pricing-card">
        <header>
            <h1>Nuestros planes</h1>
            <!-- <div class="toggle">
                <label>Annually </label>
                <div class="toggle-btn">
                    <input type="checkbox" class="checkbox" id="checkbox" />
                    <label class="sub" id="sub" for="checkbox">
                        <div class="circle"></div>
                    </label>
                </div>
                <label> Monthly</label>
            </div> -->
        </header>
        <div class="cards q-gutter-md">
            <!-- Cards -->
            <pricing-card-module :planData="plan" v-for="plan, idx in plans" :key="idx" />
        </div>
    </div>
</template>
<script>
import PricingCardModule from './Modules/PricingCardModule.vue'
export default {
    components: { PricingCardModule },
    props: {
        plans: {}
    },
    setup(props) {

    }
}
</script>

<style lang="scss">
.pricing-card {
    header {
        color: hsl(233, 13%, 49%);
        margin: 3.3rem 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .toggle {
        margin-top: 2rem;
        color: hsl(234, 14%, 74%);
        display: flex;
        align-items: center;
    }

    .toggle-btn {
        margin: 0 1rem;
    }

    .checkbox {
        display: none;
    }

    .sub {
        background: linear-gradient(135deg,
                rgba(163, 168, 240, 1) 0%,
                rgba(105, 111, 221, 1) 100%);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        /* height: 25px;
  width: 50px; */
        height: 1.6rem;
        width: 3.3rem;
        border-radius: 1.6rem;
        padding: 0.3rem;
    }

    .circle {
        background-color: #fff;
        height: 1.4rem;
        width: 1.4rem;
        border-radius: 50%;
    }

    .checkbox:checked+.sub {
        justify-content: flex-end;
    }

    .cards {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }

    .card {
        background: #fff;
        color: hsl(233, 13%, 49%);
        border-radius: 0.8rem;
    }

    .cards .card.active {
        background: linear-gradient(135deg,
                rgba(163, 168, 240, 1) 0%,
                rgba(105, 111, 221, 1) 100%);
        color: #fff;
        display: flex;
        align-items: center;
        transform: scale(1.1);
        z-index: 1;
    }

    ul {
        margin: 2.6rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }

    ul li {
        list-style-type: none;
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 1rem 0;
    }

    ul li.price {
        font-size: 3rem;
        color: hsl(232, 13%, 33%);
        padding-bottom: 2rem;
    }

    .shadow {
        box-shadow: -5px 5px 15px 1px rgba(0, 0, 0, 0.1);
    }

    .card.active .price {
        color: #fff;
    }

    .btn {
        margin-top: 1rem;
        height: 2.6rem;
        width: 13.3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        background: linear-gradient(135deg,
                rgba(163, 168, 240, 1) 0%,
                rgba(105, 111, 221, 1) 100%);
        color: #fff;
        outline: none;
        border: 0;
        font-weight: bold;
    }

    .active-btn {
        background: #fff;
        color: hsl(237, 63%, 64%);
    }

    .bottom-bar {
        border-bottom: 2px solid hsla(240, 8%, 85%, 0.582);
    }

    .card.active .bottom-bar {
        border-bottom: 2px solid hsla(240, 8%, 85%, 0.253);
    }

    .pack {
        font-size: 1.1rem;
    }

    @media (max-width: 280px) {
        ul {
            margin: 1rem;
        }

        h1 {
            font-size: 1.2rem;
        }

        .toggle {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            height: 80px;
        }

        .cards {
            margin: 0;
            display: flex;
            flex-direction: column;
        }

        .card {
            transform: scale(0.8);
            margin-bottom: 1rem;
        }

        .cards .card.active {
            transform: scale(0.8);
        }
    }

    @media (min-width: 280px) and (max-width: 320px) {
        ul {
            margin: 20px;
        }

        .cards {
            display: flex;
            flex-direction: column;
        }

        .card {
            margin-bottom: 1rem;
        }

        .cards .card.active {
            transform: scale(1);
        }
    }

    @media (min-width: 320px) and (max-width: 414px) {
        .cards {
            display: flex;
            flex-direction: column;
        }

        .card {
            margin-bottom: 1rem;
        }

        .cards .card.active {
            transform: scale(1);
        }
    }

    @media (min-width: 414px) and (max-width: 768px) {
        .card {
            margin-bottom: 1rem;
            margin-right: 1rem;
        }

        .cards .card.active {
            transform: scale(1);
        }
    }

    @media (min-width: 768px) and (max-width: 1046px) {
        .cards {
            display: flex;
        }

        .card {
            margin-bottom: 1rem;
            margin-right: 1rem;
        }

        .cards .card.active {
            transform: scale(1);
        }
    }
}
</style>