<template>
    <div class="spinner"></div>
</template>

<style scoped>
    .spinner {
        width: 20px;
        height: 20px;
        border: 3px solid transparent;
        border-radius: 50%;
        margin: auto;
        border-top-color: #2c3e50;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {transform: rotate(360deg);}
    }
</style>
