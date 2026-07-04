// 处理Hero视频
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.hero-video');
    
    if (video) {
        // 确保视频属性正确设置
        video.setAttribute('autoplay', '');
        video.setAttribute('loop', '');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.style.display = 'block';
        
        // 监听视频加载错误
        video.addEventListener('error', function() {
            console.log('视频加载失败，使用背景渐变');
            video.style.display = 'none';
        });
        
        // 监听视频加载成功
        video.addEventListener('loadeddata', function() {
            console.log('视频加载成功');
            video.play().catch(err => {
                console.log('视频自动播放失败:', err);
            });
        });
    }
});
