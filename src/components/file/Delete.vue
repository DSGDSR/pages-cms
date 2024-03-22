<template>
  <!-- Delete modal -->
  <Modal ref="deleteModal">
    <template #header>Eliminar archivo</template>
    <template #content>
      <p>Confirma que quieres eliminar "{{ props.path }}".</p>
      <footer class="flex justify-end text-sm gap-x-2 mt-4">
        <button class="btn-secondary" @click="deleteModal.closeModal()">Cancelar</button>
        <button class="btn-primary" @click="deleteEntry">
          Eliminar
          <div class="spinner-white-sm" v-if="status == 'deleting'"></div>
        </button>
      </footer>
    </template>
  </Modal>
  <!-- Waiting overlay -->
  <Teleport to="body">
    <div class="waiting" v-show="status === 'deleting'"></div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import notifications from '@/services/notifications';
import github from '@/services/github';
import Modal from '@/components/utils/Modal.vue';

const emits = defineEmits(['file-deleted', 'error']);

const props = defineProps({
  owner: String,
  repo: String,
  branch: String,
  path: String,
  sha: String
});

const deleteModal = ref(null);
const status = ref('');

const deleteEntry = async () => {
  status.value = 'deleting';
  const deleteData = await github.deleteFile(props.owner, props.repo, props.branch, props.path, props.sha);
  if (!deleteData) {
    notifications.notify(`Ha ocurrido un error al eliminar "${props.path}".`, 'error');
  } else {
    emits('file-deleted', props.path);
    notifications.notify(`"${props.path}" ha sido eliminado.`, 'success');
    deleteModal.value.closeModal();
  }
  status.value = '';
};

const openModal = () => {
  deleteModal.value.openModal();
};

defineExpose({ openModal });
</script>