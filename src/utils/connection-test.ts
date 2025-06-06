// Test functions để sử dụng trong browser console
// Copy và paste vào browser console để test nhanh

// Test 1: Basic fetch test
export const quickTest = () => {
    fetch('http://localhost:8888/api/health', {
        credentials: 'include',
        headers: {
            'Origin': window.location.origin
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('🎉 Backend connected!', data);
            alert('✅ Backend connection successful!');
        })
        .catch(error => {
            console.error('❌ Backend error:', error);
            alert('❌ Backend connection failed: ' + error.message);
        });
};

// Test 2: Với axios
export const axiosTest = async () => {
    try {
        const { checkConnection } = await import('../api');
        const result = await checkConnection();
        console.log('🎉 Axios test result:', result);
        return result;
    } catch (error) {
        console.error('❌ Axios test failed:', error);
        return { connected: false, error };
    }
};

// Expose to window for console access
if (typeof window !== 'undefined') {
    (window as any).quickTest = quickTest;
    (window as any).axiosTest = axiosTest;

    console.log(`
    🚀 Backend Test Functions Available:
    
    1. quickTest() - Test với fetch API
    2. axiosTest() - Test với axios instance
    
    Copy và paste vào console để sử dụng!
    `);
}
