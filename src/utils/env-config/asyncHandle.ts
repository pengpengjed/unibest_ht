export const asyncHandle = async (handle, errorHandle?: any) => {
  try {
    await handle()
  } catch (e) {
    console.log(e)
    errorHandle && errorHandle()
  }
}
